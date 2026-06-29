const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    mrp: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        trim: true
    },
    packetWeight: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
