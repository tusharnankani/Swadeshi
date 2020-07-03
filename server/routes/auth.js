const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

// Include models
const AuthToken = require("../models/AuthToken.js");
const Otp = require("../models/Otp.js");

router.post
(
	"/otp",
	(req, res) =>
	{
		const ph_no = req.body.ph_no.toString();

		if(isEmptyStr(ph_no))
			res.status(400).send({ "message": "Empty phone number" });

		else if(isPhoneRegEx(ph_no))
			res.status(200).send({ "message": "Phone number OK" });

		else
			res.status(400).send({ "message": "Invalid phone number format" });
	}
);

router.post
(
	"/authenticate",
	(req, res) =>
	{
		const ph_no = req.body.ph_no.toString();
		const otp = req.body.otp.toString();

		if(isEmptyStr(ph_no))
			res.status(400).send({ "message": "Empty phone number" });

		else if(isEmptyStr(otp))
			res.status(400).send({ "message": "Empty OTP" });

		else if(isPhoneRegEx(ph_no))
		{
			if(isOtpRegEx(otp))
			{
				// Get otp from db & check
				Otp.find(
					{
						_id: ObjectId(ph_no)
					}
				).then
				(
					(result) =>
					{
						const { db_ph_no, db_otp } = result;

						if(otp === db_otp)
						{
							const cookie_options = {
								maxAge: 60 * 60 * 24 * 2,
								httpOnly: true
							}
							res.cookie("x-swadeshi-auth", "auth-cookie", cookie_options);
							res.status(200).send({ "message": "Phone number & OTP OK" });
						}
						else
							res.status(403).send({ "message": "Wrong OTP" });
					}
				).catch
				(
					(err) => console.log(err)
				);
			}
			else
				res.status(400).send({ "message": "Invalid OTP format" });
		}
		else
			res.status(400).send({ "message": "Invalid phone number format" }); // not matching otp 403
	}
);

router.get
(
	"/user",
	(req, res) =>
    {
        AuthToken.find
        (
            {
                _id: ObjectId(req.body.auth_token)
            }
        ).then
        (
            (result) =>
            {
				if(Object.keys(result).length != 0)
					// Doubt: What about checking ph. no.?
					res.status(200).send({ "message": "Authenticated user" });
				else
					res.send(400).send({ "message": "User not authenticated" });
            }
        ).catch
        (
            (err) => console.log(err)
        );        
    }
);

router.get
(
	"/add",
	(req, res) =>
	{
		const entity_type = req.body.entity_type;
		const name = req.body.name;

		if(isEmptyStr(entity_type))
			res.status(400).send({ "message": "Empty entity type" });
		
		else if(isEmptyStr(name))
			res.status(400).send({ "message": "Empty name" });

		else
		{
			let bool_1 = false;
			let bool_2 = false;
			if(entity_type === "farmer")
			{
				bool_1 = false;
				bool_2 = true;
			}
			else
			{
				bool_1 = true;
				bool_2 = false;
			}

			// Add user details to db
			User.updateOne
			(
				{
					_id: ObjectId(placeholder) // Doubt: Where will the 'ph_no' var come from?
				},
				{
					$set: {
						isWholesaler: bool_1,
						isFarmer: bool_2,
						name: name
					}
				}
			).then
			(
				res.status(200).send({ "message": "User details added" })
			).catch
			(
				(err) => console.log(err)
			);

		}
	}
);


function isEmptyStr(input)
{
	if(input === "")
		return true;
	else
		return false;
}

function isPhoneRegEx(ph_no)
{
	if(/+\d{0,3} \d{10}/.test(ph_no))
		return true;
	else
		return false;
}

function isOtpRegEx(otp)
{
	if(/+\d{4}/.test(otp))
		return true;
	else
		return false;
}

module.exports = router;