const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	id: {				// Phone number
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	isWholesaler: {
		type: Boolean,
		required: true
	},
	isFarmer: {
		type: Boolean,
		required: true
	},
	products: {
		type: Array
	}
});


const User = mongoose.model("User", UserSchema);

module.exports = User;