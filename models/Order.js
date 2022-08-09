const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', OrderSchema);
