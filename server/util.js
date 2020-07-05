const mongoose = require("mongoose");

const OTP_TIMEOUT = 5 * 60; //5 minutes

const AUTH_TOKEN_LENGTH = 64;

const AUTH_COOKIE_NAME = "x-auth-id-cookie";
const AUTH_COOKIE_OPTIONS = {
	maxAge: 60 * 60 * 24 * 2 * 1000, //2 days
	httpOnly: true
};
const AUTH_COOKIE_UNSET = {
	maxAge: 0,
	httpOnly: true
};

function hasExpired(expires){
	return (!expires || expires.getTime() <= new Date().getTime());
}

async function authenticateUser(req){
	let token = await getAuthToken(req);
	if(!token || !token.isValid())
		return null;
	
	return mongoose.model("User").findOne({
		id: token.userId
	});
}

async function getAuthToken(req){
	let tokenId = req.cookies[AUTH_COOKIE_NAME];
	if(!tokenId)
		return null;
	
	return mongoose.model("AuthToken").findOne({
		id: tokenId
	});
}

module.exports = {
	OTP_TIMEOUT,
	AUTH_TOKEN_LENGTH,
	AUTH_COOKIE_NAME,
	AUTH_COOKIE_OPTIONS,
	
	hasExpired,
	authenticateUser,
	getAuthToken
};