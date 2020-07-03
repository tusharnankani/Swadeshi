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
	products: [{
		category: {
			type: String,
			required: true
		},
		item: {
			type: String,
			required: true
		},
		orig_qty: {
			type: Number,
			required: true
		},
		avail_qty: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		}
	}]
});


const User = mongoose.model("User", UserSchema);

module.exports = User;