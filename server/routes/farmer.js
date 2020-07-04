const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include model
const User = require("../models/User.js");

// To retrieve phone number if authenticated
const util = require("../util.js");

router.get(
	"/products",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		
		if(user != null)
			res.status(200).send({ products: user.products });
		else
			res.status(403).send({ message: "User not authenticated" });
	}
);

router.post(
	"/product/add",
	async (req, res) => {
		const user = await util.authenticateUser(req);

		if(user != null){
			const new_product = {
				category: req.body.category,
				item: req.body.item,
				orig_qty: req.body.orig_qty,
				avail_qty: req.body.avail_qty,
				price: req.body.price
			}
	
			await User.updateOne({id: user.id}, {
				$push: {
					products: new_product
				}
			});
			
			res.status(200).send({ message: "Product added" });
		}
		else
			res.status(401).send({ message: "User not authenticated" });
	}
);

router.delete(
	"/product/remove",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		await user.deleteOne();

		if(user != null)
			res.send(200).send({ message: "Item deleted" });
		else
			res.status(403).send({ message: "User not authenticated" });
	}
);


module.exports = router;