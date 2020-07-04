const express = require('express');

const router = express.Router();

// To retrieve user doc if authenticated
const util = require("../util.js");

// Include model
const Order = require('../models/Order.js');

router.get
(
	"/orders",
	async (req, res) =>
	{
		const user = await util.authenticateUser(req);

		Order.find
		(
			{
				id: user.id
			}
		).then
		(
			(result) => res.status(200).send({ orders: result })
		).catch
		(
			(err) => console.log(err)
		);
	}
);


module.exports = router;