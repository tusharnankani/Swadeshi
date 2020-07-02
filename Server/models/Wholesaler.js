const mongoose = require('mongoose');

const WholesalerSchema = new mongoose.Schema
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


const Wholesaler = mongoose.model('Wholesaler', WholesalerSchema);

module.exports = Wholesaler;