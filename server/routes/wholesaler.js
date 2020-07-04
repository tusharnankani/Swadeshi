const express = require('express');

const router = express.Router();

// To retrieve user doc if authenticated
const util = require("../util.js");

// Include model
const Order = require('../models/Order.js');

router.get(
	"/orders",
	async (req, res) => {
		const user = await util.authenticateUser(req);

		let orders = await Order.find({
			id: user.id
		});
		
		res.status(200).send({ orders });
	}
);


module.exports = router;