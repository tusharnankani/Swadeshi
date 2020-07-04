const Util = require("../util.js");
const mongoose = require("mongoose");

const AuthTokenSchema = new mongoose.Schema({
	id: {					// Auth token
		type: String,
		required: true,
		unique: true,
	},
	userId: {				// Phone number
		type: String,
		required: true
	},
	expires: {
		type: Date,
		required: true
	}
});

//Must be normal function, because arrow functions use this of the current context
AuthTokenSchema.methods.isValid = function(){
	return !Util.hasExpired(this.expires);
}

AuthTokenSchema.statics.generateToken = async (phone) => {
	let token = "";
	for(let i = 0; i < Util.AUTH_TOKEN_LENGTH; i++)
		token += Math.floor(Math.random() * 0xf).toString(16);
	
	let expires = new Date();
	expires.setSeconds(expires.getSeconds() + Util.AUTH_COOKIE_OPTIONS.maxAge);
	
	await mongoose.model("AuthToken").findOneAndUpdate(
		{id: token},
		{$set: {userId: phone, expires}},
		{upsert: true}
	);
	
	console.log("Generated Auth token:", phone, token)
	
	return token;
}

const AuthToken = mongoose.model("AuthToken", AuthTokenSchema);

module.exports = AuthToken;