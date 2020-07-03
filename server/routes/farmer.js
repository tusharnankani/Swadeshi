const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include model
const User = require("../models/User.js");

router.post
(
	"/add",
	(req, res) =>
	{
		// Doubt: If we need to insert stuff like this, the User model needs to be modified.
		const new_product = {
			category: req.body.category,
			item: req.body.item,
			orig_qty: req.body.orig_qty,
			avail_qty: req.body.avail_qty,
			price: req.body.price
		}

		// Doubt: Will the phone no. have to be accessed from the auth token sent by the browser and then put below in the update query?
		const placeholder = 0;

		User.updateOne
		(
			{
				_id: ObjectId(placeholder)
			},
			{
				$push: {
					products: new_product
				}
			}
		).then
		(
			(result) => res.status(200).send("Product added")
		).catch
		(
			(err) => console.log(err)
		);
	}
);


module.exports = router;