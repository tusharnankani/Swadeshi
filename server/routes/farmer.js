const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include model
const User = require("../models/User.js");

// To retrieve user doc if authenticated
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
			user.products.push(req.body);
			user.save();
			
			res.status(200).send({ message: "Product added" });
		}
		else
			res.status(401).send({ message: "User not authenticated" });
	}
);

router.delete(
	"/product",
	async (req, res) => {
		const user = await util.authenticateUser(req);
		if(user == null){
			res.status(403).send({ message: "User not authenticated" });
			return;
		}
		else if(!req.body.item){
			res.status(400).send({ message: "No item to delete" });
		}
		
		user.products = user.products.filter(e => e.item != req.body.item);
		await user.save();
		
		res.status(200).send({ message: "OK" });
	}
);


module.exports = router;