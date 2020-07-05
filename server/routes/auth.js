const Util = require("../util.js");
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

router.post(
	"/",
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
				Util.AUTH_COOKIE_NAME,
				await AuthToken.generateToken(phone),
				Util.AUTH_COOKIE_OPTIONS
			);
			res.status(200).send(RESPONSE.OK);
		}
	}
);

router.get(
	"/logout",
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
	"/otp",
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
	"/user",
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
	"/add",
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

module.exports = router;