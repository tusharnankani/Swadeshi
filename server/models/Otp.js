const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema
(
    {
        _id: {                  // Phone number
            type: Object(),
            required: true
        },
        otp: {
            type: Number,
            required: true
        }
    }
);


const Otp = mongoose.model('Otp', OtpSchema);

modeule.exports = Otp;