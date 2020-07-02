const mongoose = require('mongoose');

const AuthTokenSchema = new mongoose.Schema
(
    {
        _id: {                  // Auth token
            type: ObjectId,
            required: true
        },
        ph_no: {
            type: ObjectId,
            required: true
		},
		exp_date: {
			type: Date,
			required: true
		}
    }
);


const AuthToken = mongoose.model('Otp', AuthTokenSchema);

modeule.exports = AuthToken;