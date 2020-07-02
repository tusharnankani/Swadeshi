const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema
(
    {
        _id: {                  // Phone number
            type: ObjectId,
            required: true
        },
        otp: {
            type: int,
            required: true
        }
    }
);


const Otp = mongoose.model('Otp', OtpSchema);

modeule.exports = Otp;