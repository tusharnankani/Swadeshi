const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include models
const AuthToken = require("../models/AuthToken.js");
const Otp = require("../models/Otp.js");

const VALIDATE = {
	PHONE: /\+\d{0,3} \d{10}/,
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

const AUTH_COOKIE_OPTIONS = {
	maxAge: 60 * 60 * 24 * 2, //2 days
	httpOnly: true
};

router.post(
	"/otp",
	(req, res) => {
		const phone = req.body.phone_number.toString();

		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		else
			res.status(200).send(RESPONSE.OK);
	}
);

router.post(
	"/authenticate",
	async (req, res) => {
		const phone = req.body.phone_number.toString();
		const otp = req.body.otp.toString();

		if(!VALIDATE.PHONE.test(phone))
			res.status(400).send(RESPONSE.INVALID_PHONE);
		
		else if(!VALIDATE.OTP.test(otp))
			res.status(400).send(RESPONSE.INVALID_OTP);
		
		else if(!await isValidOtp(phone, otp))
			res.status(401).send(RESPONSE.WRONG_OTP);
		
		else{
			const cookie_options = {
				maxAge: 60 * 60 * 24 * 2,
				httpOnly: true
			}
			res.cookie("x-swadeshi-auth", "auth-cookie", cookie_options);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

async function isValidOtp(phone, otp){
	return Otp.find({
			_id: ObjectId(phone)
		})
		.then(e => e.otp == otp)
		.catch(console.error);
}

router.get(
	"/user",
	async (req, res) => {
		let user = authenticateUser(req.body.auth_token);
		if(user == null)
			res.status(403).send(RESPONSE.ACCESS_DENIED);
		else
			res.status(200).send(user);
    }
);

async function authenticateUser(tokenId){
	let token = await AuthToken.find({
		_id: ObjectId(tokenId)
	});
	
	if(!token.expires || new Date().getTime() > token.expires.getTime())
		return null;
	
	return await User.find({
		_id: ObjectId(token.userId)
	});
}

router.get(
	"/add",
	async (req, res) => {
		let user = authenticateUser(req.body.auth_token);
		if(user == null){
			res.status(403).send(RESPONSE.ACCESS_DENIED);
			return;
		}
		
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