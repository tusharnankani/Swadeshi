async function sendMockApiRequest(url, options){
	return router.route(url, options);
}

async function checkMockAuthentication(){
	let path = await routePath();
	if(!path)
		return;
	path = "/Swadeshi" + path;
	if((path + "/") != window.location.pathname && path != window.location.pathname)
		window.location.pathname = path;
}

window.addEventListener("load", () => {
	sendApiRequest = sendMockApiRequest;
	checkAuthentication = checkMockAuthentication;
});

//Router

class Router{
	routes;
	constructor(){
		this.routes = {
			get: [],
			post: [],
			delete: [],
			patch: []
		};
	}
	
	get(path, handler){
		this.addRoute("get", path, handler);
	}
	
	post(path, handler){
		this.addRoute("post", path, handler);
	}
	
	delete(path, handler){
		this.addRoute("delete", path, handler);
	}
	
	patch(path, handler){
		this.addRoute("patch", path, handler);
	}
	
	addRoute(method, path, handler){
		this.routes[method].push({
			path: this.parsePath(path),
			handler
		});
	}
	
	parsePath(path){
		if(typeof path == "string")
			return new RegExp("^" + this.normalizePath(path) + "$");
		
		return path;
	}
	
	normalizePath(path){
		if(typeof path == "string" && path.endsWith("/") && path != "/")
			path = path.substring(0, path.length - 1);
		
		return path;
	}
	
	async route(urlString, options = {}){
		options = clone(options);
		
		if(!options.method)
			options.method = "GET";
		
		console.log(options.method, urlString, options.body);
		
		let url = new URL(urlString, window.location.href || "http://x.com");
		
		if(options.body)
			try{
				options.body = JSON.parse(options.body);
			}
			catch(e){}
		
		options.cookies = getAllCookies();
		
		let res = await this.getResponse(this.normalizePath(url.pathname), options);
		
		console.log("RES:", res.statusCode, res.body);
		
		return new Response(res.body, {
			status: res.statusCode,
			headers: res.headers
		});
	}
	
	async getResponse(path, options){
		let method = options.method.toLowerCase();
		let routes = this.routes[method];
		
		let res = new RouterResponse();
		
		if(!routes){
			res.status(400).send({
				message: "Invalid HTTP method: " + method
			});
			return res;
		}
		
		let req = options;
		for(let r of routes)
			if(r.path.test(path)){
				await r.handler(req, res);
				return res;
			}
		
		res.status(404).send({
			message: options.method + " " + path + " not found"
		});
		return res;
	}
}

class RouterResponse{
	statusCode;
	body;
	
	status(code){
		this.statusCode = code;
		return this;
	}
	
	getStatus(){
		return this.statusCode;
	}
	
	json(data){
		if(typeof data != "object")
			data = JSON.stringify(data);
		
		return this.send(data);
	}
	
	send(data){
		if(this.body)
			throw new Error("Response already sent");
		
		if(typeof data == "object")
			data = JSON.stringify(data);
		this.body = data;
		
		return this;
	}
	
	cookie(name, value, options){
		console.log("COOK", name, value, options);
		setCookie(name, value, options);
	}
}

const router = new Router();


//Utility functions

const AUTH_COOKIE_NAME = "x-auth-id-cookie";
const AUTH_COOKIE_OPTIONS = {
	maxAge: 60 * 60 * 24 * 2 * 1000, //2 days
	httpOnly: true
};
const AUTH_COOKIE_UNSET = {
	maxAge: 0,
	httpOnly: true
};

class Util{
	static async getAuthToken(req){
		let tokenId = req.cookies[AUTH_COOKIE_NAME];
		if(!tokenId)
			return null;
		
		return AuthToken.get(tokenId);
	}
	
	static async authenticateUser(req){
		let token = await Util.getAuthToken(req);
		if(!token || !token.isValid())
			return null;
		
		return User.get(token.userId);
	}
	
	static hasExpired(date){
		return !!date && (date.getTime() <= new Date().getTime());
	}
}

function setCookie(name, value = "", options = {}){
	let cookie = name + "=" + value + ";";
	
	if(options.maxAge){
		maxAge = new Date();
		maxAge.setMilliseconds(maxAge.getMilliseconds() + options.maxAge);
		cookie += "max-age=" + maxAge.toUTCString() + ";";
	}
	
	cookie += "path=/;";
	
	console.log(name, value, cookie);
	document.cookie = cookie;
}

function getAllCookies(name){
	let cookies = {};
	let k, v;
	if(document.cookie)
		for(let c of document.cookie.split(";")){
			[k, v] = c.split("=");
			cookies[k.trim()] = v.trim();
		}
	
	return cookies;
}

function clone(obj){
	if(obj === null || typeof (obj) !== "object" || "isActiveClone" in obj)
		return obj;

	let temp;
	if(obj instanceof Date)
		temp = new Date(obj);
	else
		temp = obj.constructor();

	for(let key in obj)
		if(Object.prototype.hasOwnProperty.call(obj, key)){
			obj.isActiveClone = null;
			temp[key] = clone(obj[key]);
			delete obj.isActiveClone;
		}
	
	return temp;
}


//Models

class Database{
	static DATABASE_NAME = "database";
	static tables = Database.load();

	static get(key){
		if(!Database.tables[key])
			Database.tables[key] = {};
		
		return Database.tables[key];
	}
	
	static save(){
		localStorage[Database.DATABASE_NAME] = JSON.stringify(Database.tables);
	}
	
	static load(){
		if(localStorage[Database.DATABASE_NAME])
			return JSON.parse(localStorage[Database.DATABASE_NAME]);
		else
			return {};
	}
}

window.addEventListener("beforeunload", Database.save);

class AuthToken{
	static TABLE_NAME = "AuthToken";
	static tokens = Database.get(AuthToken.TABLE_NAME);
	
	constructor(data){
		this.id = data.id;
		this.userId = data.userId;
		
		let expiry;
		if(data.expiry)
			expiry = new Date(data.expiry);
		else{
			expiry = new Date();
			expiry.setDate(expiry.getDate() + 2);
		}
		this.expiry = expiry;
	}
	
	static generateToken(phone){
		let token = "";
		for(let i = 0; i < 64; i++)
			token += Math.floor(16 * Math.random()).toString(16);
		
		AuthToken.tokens[token] = new AuthToken({
			id: token,
			userId: phone
		});
		
		return token;
	}
	
	static get(id){
		if(!AuthToken.tokens[id])
			return null;
		else if(!(AuthToken.tokens[id] instanceof AuthToken))
			AuthToken.tokens[id] = new AuthToken(AuthToken.tokens[id]);
		
		return AuthToken.tokens[id];
	}
	
	isValid(){
		return !Util.hasExpired(this.expiry);
	}
	
	deleteOne(){
		delete AuthToken.tokens[this.id];
	}
}

class Order{
	static TABLE_NAME = "Order"
	static orders = Database.get(Order.TABLE_NAME);
	
	constructor(data){
		this._id = data._id || Math.random().toString().substring(2);
		this.wholesalerId = data.wholesalerId;
		this.farmerId = data.farmerId;
		this.date = data.date;
		this.isOpen = data.isOpen;
		this.product = data.product;
		this.quantity = data.quantity;
	}
	
	static find(match){
		let result = [];
		
		for(let o in Order.orders){
			result.push(Order.orders[o]);
			for(let k in match)
				if(Order.orders[o][k] != match[k]){
					result.pop();
					break;
				}
		}
		
		for(let i = 0; i < result.length; i++)
			if(!(result[i] instanceof Order))
				result[i] = new Order(result[i]);
		
		return result;
	}
	
	static get(_id){
		if(!(Order.orders[_id] instanceof Order))
			Order.orders[_id] = new Order(Order.orders[_id]);
		return Order.orders[_id];
	}
	
	async save(){
		Order.orders[this._id] = this;
		Database.save();
	}
}

class Otp{
	static TABLE_NAME = "Otp";
	static otps = Database.get(Otp.TABLE_NAME);

	static generate(phone){
		let otp = "";
		for(let i = 0; i < 4; i++)
			otp += Math.floor(10 * Math.random()).toString();
		
		console.log("OTP:", otp);
		alert("(Only for live demo)\nOTP: " + otp);
		
		let expiry = new Date();
		expiry.setMinutes(expiry.getMinutes() + 5);
		
		Otp.otps[phone] = {
			otp,
			expiry
		};
	}
	
	static isValid(phone, inputOtp){
		let otp = Otp.otps[phone];
		if(!otp)
			return false;
		
		return otp.otp == inputOtp && !Util.hasExpired(otp.expiry);
	}
}

class User{
	static TABLE_NAME = "User";
	static users = Database.get(User.TABLE_NAME);
	
	constructor(data){
		this.id = data.id;
		this.name = data.name;
		this.isFarmer = data.isFarmer;
		this.isWholesaler = data.isWholesaler;
		this.products = data.products || [];
	}
	
	static get(id){
		if(!User.users[id])
			return null;
		else if(!(User.users[id] instanceof User))
			User.users[id] = new User(User.users[id]);
		
		return User.users[id];
	}
	
	static findOneAndUpdate(find, action){
		if(!User.users[find.id])
			User.users[find.id] = new User(action["$set"]);
		
		return User.get(find.id);
	}
	
	static find(match){
		let result = [];
		
		for(let o in User.users){
			result.push(User.users[o]);
			for(let k in match)
				if(User.users[o][k] != match[k]){
					result.pop();
					break;
				}
		}
		
		return result;
	}
	
	async save(){
		Database.save();
	}
}




//Routes

const VALIDATE = {
	PHONE: /\d{10}/,
	OTP: /\d{4}/,
	NAME: /[^\s\d]{3,}/
};

const RESPONSE = {
	OK: {
		message: "OK"
	},
	INVALID_PHONE: {
		message: "Invalid Phone number"
	},
	INVALID_OTP: {
		message: "Invalid Otp"
	},
	INVALID_NAME: {
		message: "Invalid Name"
	},
	INVALID_ENTITY: {
		message: "User must be Farmer or Wholesaler"
	},
	WRONG_OTP:{
		message: "Wrong Otp"
	},
	ACCESS_DENIED: {
		message: "Access Denied"
	},
	NOT_FOUND: {
		message: "Not found"
	}
};

router.post(
	"/auth/",
	async (req, res) => {
		const phone = req.body.phoneNumber;
		const otp = req.body.otp;

		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		
		else if(!VALIDATE.OTP.test(otp))
			res.status(400).send(RESPONSE.INVALID_OTP);
		
		else if(!await Otp.isValid(phone, otp))
			res.status(401).send(RESPONSE.WRONG_OTP);
		
		else{
			res.cookie(
				AUTH_COOKIE_NAME,
				await AuthToken.generateToken(phone),
				AUTH_COOKIE_OPTIONS
			);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

router.get(
	"/auth/logout",
	async (req, res) => {
		await Util.getAuthToken(req)
			.then(e => e.deleteOne());
		
		res.cookie(
			Util.AUTH_COOKIE_NAME,
			"",
			Util.AUTH_COOKIE_UNSET
		);
		res.status(200).send(RESPONSE.OK);
	}
);

router.post(
	"/auth/otp",
	async (req, res) => {
		let phone = req.body.phoneNumber;
		
		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		else{
			await Otp.generate(phone);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

router.get(
	"/auth/user",
	async (req, res) => {
		let token = await Util.getAuthToken(req);
		if(!token || !token.isValid()){
			res.status(403).send(RESPONSE.ACCESS_DENIED);
			return;
		}
		
		let user = await Util.authenticateUser(req);
		if(user != null)
			res.status(200).send(user);
		else
			res.status(404).send(RESPONSE.NOT_FOUND);
    }
);

router.post(
	"/auth/add",
	async (req, res) => {
		let token = await Util.getAuthToken(req);
		if(!token || !token.isValid()){
			res.status(403).send(RESPONSE.ACCESS_DENIED);
			return;
		}
		
		let body = req.body;

		if(!VALIDATE.NAME.test(body.name))
			res.status(400).send(RESPONSE.INVALID_NAME);

		else if(!body.isWholesaler && !body.isFarmer)
			res.status(400).send(RESPONSE.INVALID_ENTITY);
		
		else{
			await User.findOneAndUpdate(
				{id: token.userId},
				{$set: {
					id: token.userId,
					name: body.name,
					isFarmer: body.isFarmer,
					isWholesaler: body.isWholesaler
				}},
				{upsert: true}
			);
			
			res.status(200).send();
		}
	}
);

router.get(
	"/farmer/products",
	async (req, res) => {
		const user = await Util.authenticateUser(req);
		
		if(user != null)
			res.status(200).send({ products: user.products });
		else
			res.status(403).send({ message: "User not authenticated" });
	}
);

router.post(
	"/farmer/product/add",
	async (req, res) => {
		const user = await Util.authenticateUser(req);

		if(user != null){
			user.products.push(req.body);
			user.save();
			
			res.status(200).send({ message: "Product added" });
		}
		else
			res.status(401).send({ message: "User not authenticated" });
	}
);

router.delete(
	"/farmer/product",
	async (req, res) => {
		const user = await Util.authenticateUser(req);
		if(user == null){
			res.status(403).send({ message: "User not authenticated" });
			return;
		}
		else if(!req.body.item){
			res.status(400).send({ message: "No item to delete" });
		}
		
		user.products = user.products.filter(e => e.item != req.body.item);
		await user.save();
		
		res.status(200).send({ message: "OK" });
	}
);


router.post(
	"/wholesaler/orders",
	async (req, res) => {
		const user = await Util.authenticateUser(req);
		if(user == null){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let data = req.body;
		let order = new Order({
			wholesalerId: data.wholesalerId,
			farmerId: data.farmerId,
			product: data.product,
			date: data.date,
			isOpen: true,
			quantity: data.quantity
		});
		await order.save();
		
		res.status(200).send({
			_id: order._id,
			message: "OK"
		});
	}
);

router.get(
	"/wholesaler/orders",
	async (req, res) => {
		const user = await Util.authenticateUser(req);
		if(user == null){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let orders;
		if(user.isFarmer)
			orders = await Order.find({ farmerId: user.id });
		else if(user.isWholesaler)
			orders = await Order.find({ wholesalerId: user.id });
		
		res.status(200).send({ orders });
	}
);

router.patch(
	"/wholesaler/orders/complete",
	async (req, res) => {
		const user = await Util.authenticateUser(req);
		if(user == null){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let order = await Order.get(req.body._id);
		order.isOpen = false;
		
		res.status(200).send({ message: "OK" });
	}
);

router.get(
	"/wholesaler/farmers",
	async (req, res) => {
		const user = await Util.authenticateUser(req);
		if(user == null || !user.isWholesaler){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let farmers = await User.find({ isFarmer: true });
		res.status(200).send({ farmers });
	}
);
