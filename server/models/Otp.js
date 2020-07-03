const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
	_id: {				// Phone number
		type: Object(),
		required: true
	},
	otp: {
		type: String,
		required: true
	},
	expiry: {
		type: Date,
		required: true
	}
});


const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;