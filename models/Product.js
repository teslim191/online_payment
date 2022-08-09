const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Product', ProductSchema);