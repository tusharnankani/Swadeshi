const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
	wholesaler_id: {					// Phone number
		type: Object(),
		required: true
	},
	farmer_id: {				// Phone number
		type: Object(),
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	isOpen : {
		type: Boolean,
		required: true
	}
});


const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;