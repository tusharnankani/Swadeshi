const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema
(
    {
        _id: {                  // Phone number
            type: ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String
        }
    }
);


const Farmer = mongoose.model('Farmer', FarmerSchema);

module.exports = Farmer;