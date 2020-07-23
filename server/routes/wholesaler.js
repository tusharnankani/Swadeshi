const express = require("express");

const router = express.Router();

// To retrieve user doc if authenticated
const util = require("../util.js");

// Include model
const User = require("../models/User.js");
const Order = require("../models/Order.js");

router.post(
	"/orders",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		if(user == null){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let data = req.body;
		let order = new Order({
			wholesalerId: data.wholesalerId,
			farmerId: data.farmerId,
			product: data.product,
			date: data.date,
			isOpen: true,
			quantity: data.quantity
		});
		await order.save();
		
		res.status(200).send({
			_id: order._id,
			message: "OK"
		});
	}
);

router.get(
	"/orders",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		if(user == null){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let orders;
		if(user.isFarmer)
			orders = await Order.find({ farmerId: user.id });
		else if(user.isWholesaler)
			orders = await Order.find({ wholesalerId: user.id });
		
		res.status(200).send({ orders });
	}
);

router.patch(
	"/orders/complete",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		if(user == null){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		await Order.findOneAndUpdate({
			_id: req.body._id
		}, {
			$set: {
				isOpen: false
			}
		});
		
		res.status(200).send({ message: "OK" });
	}
);

router.get(
	"/farmers",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		if(user == null || !user.isWholesaler){
			res.status(401).send({ message: "Access Denied" });
			return;
		}
		
		let farmers = await User.find({ isFarmer: true });
		res.status(200).send({ farmers });
	}
);

module.exports = router;