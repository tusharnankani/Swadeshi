const get = document.querySelector.bind(document);

async function checkAuthentication(){
	let r = await sendApiRequest("/auth/user");
	let data = await r.json();
	
	let path;
	if(r.status == 200){
		if(data.isFarmer)
			path = "/farmer";
		else if(data.isWholesaler)
			path = "/wholesaler";
	}
	else if(r.status == 403)
		path = "/";
	else if(r.status == 404)
		path = "/signup";
	
	if(path && (path + "/") != window.location.pathname && path != window.location.pathname)
		window.location.pathname = path;
}

async function sendApiRequest(url, options = {}){
	options = Object.assign({}, options);
	
	if(typeof options.body == "object"){
		if(!options.headers)
			options.headers = {};
		if(!options.headers["Content-Type"])
			options.headers["Content-Type"] = "application/json";
		
		options.body = JSON.stringify(options.body);
	}
	
	return fetch(url, options);
}

async function assertOK(e){
	if(!e || !e.status || e.status != 200)
		throw new Error("Assert OK failed");
	
	return e;
}

function isInputValid(input){
	return new RegExp(input.pattern).test(input.value);
}