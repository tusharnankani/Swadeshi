const Util = require("../util.js");
const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
	id: {				// Phone number
		type: String,
		required: true,
		unique: true,
	},
	otp: {
		type: String,
		required: true
	},
	expires: {
		type: Date,
		required: true
	}
});

OtpSchema.statics.generate = async (phone) => {
	let otp = Math.floor(Math.random() * 10_000).toString().padStart(4, 0);
	
	let expires = new Date();
	expires.setSeconds(expires.getSeconds() + Util.OTP_TIMEOUT);
	
	await mongoose.model("Otp").findOneAndUpdate(
		{id: phone},
		{$set: {otp, expires}},
		{upsert: true}
	);
	
	console.log("Generated OTP:", phone, otp);
}

OtpSchema.statics.isValid = async (phone, inputOtp) => {
	if(!phone || !inputOtp)
		return false;
	
	let otp = await mongoose.model("Otp").findOne({id: phone});
	if(!otp)
		return false;
	
	if(otp.otp == inputOtp && otp.id == phone){
		await otp.deleteOne();		
		return !Util.hasExpired(otp.expires);
	}
	
	return false;
}

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;