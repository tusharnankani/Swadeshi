const mongoose = require("mongoose");

const AuthTokenSchema = new mongoose.Schema({
	_id: {					// Auth token
		type: Object(),
		required: true
	},
	userId: {				// Phone number
		type: Object(),
		required: true
	},
	expires: {
		type: Date,
		required: true
	}
});


const AuthToken = mongoose.model("AuthToken", AuthTokenSchema);

module.exports = AuthToken;