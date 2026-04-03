const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Snack'],
        default: 'Main Course'
    },
    image: {
        type: String,
        default: ''
    },
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Canteen',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
