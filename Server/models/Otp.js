const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema
(
    {
        _id: {                  // 4 digit OTP
            type: ObjectID,
            required: true
        },
        ph_no: {
            type: int,
            required: true
        }
    }
);


const Otp = mongoose.model('Otp', OtpSchema);

modeule.exports = Otp;