const mongoose = require('mongoose');

const AuthTokenSchema = new mongoose.Schema
(
    {
        _id: {                  // Auth token
            type: Object(),
            required: true
        },
        ph_no: {
            type: Object(),
            required: true
		},
		exp_date: {
			type: Date,
			required: true
		}
    }
);


const AuthToken = mongoose.model('Otp', AuthTokenSchema);

module.exports = AuthToken;