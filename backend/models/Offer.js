const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    discount: {
        type: String,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Canteen',
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['student', 'combo', 'time', 'special', 'loyalty', 'seasonal', 'clearance'],
        default: 'student'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'expired', 'upcoming', 'paused'],
        default: 'active'
    },
    usageLimit: {
        type: String,
        required: true,
        trim: true
    },
    minOrder: {
        type: String,
        required: true,
        trim: true
    },
    maxDiscount: {
        type: String,
        trim: true
    },
    applicableItems: [{
        type: String,
        trim: true
    }],
    exclusions: [{
        type: String,
        trim: true
    }],
    color: {
        type: String,
        required: true,
        enum: ['from-blue-500 to-purple-500', 'from-orange-500 to-red-500', 'from-green-500 to-teal-500', 'from-pink-500 to-rose-500', 'from-yellow-500 to-orange-500'],
        default: 'from-blue-500 to-purple-500'
    },
    terms: {
        type: String,
        trim: true
    },
    priority: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    redemptions: [{
        code: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        maxUsage: {
            type: Number,
            required: true
        },
        validUntil: {
            type: Date,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    clickCount: {
        type: Number,
        default: 0
    },
    conversionRate: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
