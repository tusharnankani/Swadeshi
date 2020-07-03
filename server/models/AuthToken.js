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


const AuthToken = mongoose.model("AuthToken", AuthTokenSchema);

module.exports = AuthToken;