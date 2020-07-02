const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		_id: {				// Phone number
			type: ObjectId,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String
		},
		isWholesaler: {
			type: boolean,
			required: true
		},
		isFarmer: {
			type: boolean,
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
				type: double,
				required: true
			},
			avail_qty: {
				type: double,
				required: true
			},
			price: {
				type: double,
				required: true
			}
		}]
	}
);


const User = mongoose.model("User", UserSchema);

module.exports = User;