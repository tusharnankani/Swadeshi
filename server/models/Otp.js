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


const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;