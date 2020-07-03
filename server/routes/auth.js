const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include models
const AuthToken = require("../models/AuthToken.js");
const Otp = require("../models/Otp.js");

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
	}
};

const AUTH_TOKEN_LENGTH = 64;

const AUTH_COOKIE_NAME = "x-auth-id-cookie";
const AUTH_COOKIE_OPTIONS = {
	maxAge: 60 * 60 * 24 * 2, //2 days
	httpOnly: true
};

router.post(
	"/",
	async (req, res) => {
		const phone = req.body.phoneNumber;
		const otp = req.body.otp;

		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		
		else if(!VALIDATE.OTP.test(otp))
			res.status(400).send(RESPONSE.INVALID_OTP);
		
		else if(!await isValidOtp(phone, otp))
			res.status(401).send(RESPONSE.WRONG_OTP);
		
		else{
			res.cookie(AUTH_COOKIE_NAME, generateAuthToken(phone), AUTH_COOKIE_OPTIONS);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

async function isValidOtp(phone, otp){
	if(!phone || !otp)
		return false;
	
	return Otp.find({
			_id: ObjectId(phone)
		})
		.then(e => e.otp == otp)
		.catch(console.error);
}

router.post(
	"/otp",
	(req, res) => {
		let phone = req.body.phoneNumber || "8454975833";
		
		console.log("POST BODY:", req.body);
		
		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		else{
			generateOtp(phone);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

function generateOtp(phone){
	let otp = Math.floor(Math.random() * 10_000).toString().padStart(4, 0);
	
	console.log("Generated OTP:", phone, otp);
}

function generateAuthToken(phone){
	let token = "";
	for(let i = 0; i < AUTH_TOKEN_LENGTH; i++)
		token += Math.floor(Math.random() * 0xf).toString(16);
	
	console.log("Generated Auth token:", phone, token)
	
	return token;
}

async function authenticateUser(req, res){
	let token = await AuthToken.find({
		_id: ObjectId(req.cookies[AUTH_COOKIE_NAME])
	});
	
	if(
		!req.cookies[AUTH_COOKIE_NAME] ||
		!token.expires ||
		new Date().getTime() > token.expires.getTime()
	){
		res.status(403).send(RESPONSE.ACCESS_DENIED);
		return null;
	}
	
	return await User.find({
		_id: ObjectId(token.userId)
	});
}

router.get(
	"/user",
	async (req, res) => {
		let user = await authenticateUser(req, res);
		if(user != null)
			res.status(200).send(user);
    }
);

router.get(
	"/add",
	async (req, res) => {
		let user = authenticateUser(req, res);
		if(user == null)
			return;
		
		let token = await AuthToken.find({
			_id: ObjectId(tokenId)
		});
		
		const body = req.body;

		if(!VALIDATE.NAME.test(body.name))
			res.status(400).send(RESPONSE.INVALID_NAME);

		else if(!body.isWholesaler && !body.isFarmer)
			res.status(400).send(RESPONSE.INVALID_ENTITY);
		
		else{
			await User.updateOne({
					_id: ObjectId(token.userId)
				},
				{
					$set: {
						name: body.name,
						isFarmer: body.isFarmer,
						isWholesaler: body.isWholesaler
					}
				}
			);
			
			res.status(200).send();
		}
	}
);

module.exports = router;