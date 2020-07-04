const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include model
const User = require("../models/User.js");

// To retrieve phone number if authenticated
const util = require("../util.js");

router.get
(
	"/products",
	async (req, res) =>
	{
		const ph_no = await util.authenticateUser(req);

		if(ph_no != null)
		{
			User.find
			(
				{
					id: ph_no
				},
			).then
			(
				(result) =>
				{
					res.status(200).send({ "products": result.products });
				}
			).catch
			(
				(err) => console.log(err)
			);
		}
		else
			res.status(401).send({ "message": "User not authenticated" });
	}
);

router.post
(
	"/product/add",
	async (req, res) =>
	{
		const ph_no = await util.authenticateUser(req);

		if(ph_no != null)
		{
			const new_product = {
				category: req.body.category,
				item: req.body.item,
				orig_qty: req.body.orig_qty,
				avail_qty: req.body.avail_qty,
				price: req.body.price
			}
	
			User.updateOne
			(
				{
					id: ph_no
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
		else
			res.status(401).send({ "message": "User not authenticated" });
	}
);

router.delete
(
	"/product/remove",
	async (req, res) =>
	{
		const ph_no = await util.authenticateUser(req);

		if(ph_no != null)
		{
			User.updateOne
			(
				{
					id: ph_no
				},
				{
					$pull: {
						products: {
							item: req.body.item
						}
					}
				}
			).then
			(
				res.send(200).send({ "message": "Item deleted" })
			).catch
			(
				(err) => console.log(err)
			);
		}
		else
			res.status(401).send({ "message": "User not authenticated" });
	}
);


module.exports = router;