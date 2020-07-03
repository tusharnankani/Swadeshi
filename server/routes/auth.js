const express = require("express");

const router = express.Router();

// Include models
const Otp = require("../models/Otp.js");
const User = require("../models/User.js");
const AuthToken = require("../models/AuthToken.js");

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

const OTP_TIMEOUT = 5 * 60; //5 minutes

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
			res.cookie(AUTH_COOKIE_NAME, await generateAuthToken(phone), AUTH_COOKIE_OPTIONS);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

async function isValidOtp(phone, inputOtp){
	if(!phone || !inputOtp)
		return false;
	
	let otp = await Otp.findOne({
			id: phone
		});
	
	if(otp.otp == inputOtp && !hasExpired(otp.expires)){
		otp.deleteOne();
		return true;
	}
	
	return false;
}

function hasExpired(expires){
	return (!expires || new Date().getTime() > expires.getTime());
}

router.post(
	"/otp",
	async (req, res) => {
		let phone = req.body.phoneNumber;
		
		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		else{
			await generateOtp(phone);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

async function generateOtp(phone){
	let otp = Math.floor(Math.random() * 10_000).toString().padStart(4, 0);
	
	let expires = new Date();
	expires.setSeconds(expires.getSeconds() + OTP_TIMEOUT);
	
	await Otp.findOneAndUpdate(
		{id: phone},
		{$set: {otp, expires}},
		{upsert: true}
	);
	
	console.log("Generated OTP:", phone, otp);
}

async function generateAuthToken(phone){
	let token = "";
	for(let i = 0; i < AUTH_TOKEN_LENGTH; i++)
		token += Math.floor(Math.random() * 0xf).toString(16);
	
	let expires = new Date();
	expires.setSeconds(expires.getSeconds() + AUTH_COOKIE_OPTIONS.maxAge);
	
	await AuthToken.findOneAndUpdate(
		{id: token},
		{$set: {phone, expires}},
		{upsert: true}
	);
	
	console.log("Generated Auth token:", phone, token)
	
	return token;
}

router.get(
	"/user",
	async (req, res) => {
		let user = await authenticateUser(req);
		if(user != null)
			res.status(200).send(user);
		else
			res.status(404).send(RESPONSE.NOT_FOUND);
    }
);

router.get(
	"/add",
	async (req, res) => {
		let user = authenticateUser(req);
		if(user == null){
			res.status(403).send(RESPONSE.ACCESS_DENIED);
			return;
		}
		
		let token = await getAuthToken(req);
		let body = req.body;

		if(!VALIDATE.NAME.test(body.name))
			res.status(400).send(RESPONSE.INVALID_NAME);

		else if(!body.isWholesaler && !body.isFarmer)
			res.status(400).send(RESPONSE.INVALID_ENTITY);
		
		else{
			await new User({
				id: token.userId,
				name: body.name,
				isFarmer: body.isFarmer,
				isWholesaler: body.isWholesaler
			});
			
			res.status(200).send();
		}
	}
);

async function authenticateUser(req){
	let token = await getAuthToken(req);
	
	if(!token || hasExpired(token.expires))
		return null;
	
	return await User.findOne({
		id: token.userId
	});
}

async function getAuthToken(req){
	let tokenId = req.cookies[AUTH_COOKIE_NAME];
	if(!tokenId)
		return null;
	
	return AuthToken.findOne({
		id: tokenId
	});
}

module.exports = router;