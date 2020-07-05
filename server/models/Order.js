const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	wholesalerId: {					// Phone number
		type: String,
		required: true
	},
	farmerId: {				// Phone number
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	isOpen: {
		type: Boolean,
		required: true
	},
	product: {
		type: Object,
		required: true
	},
	quantity: {
		type: Number,
		required: true
	}
});


const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;