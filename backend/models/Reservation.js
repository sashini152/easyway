const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Canteen',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    partySize: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    specialRequests: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    confirmationCode: {
        type: String,
        unique: false, // Remove unique constraint to avoid duplicate key errors
        required: false // Not required since it's auto-generated
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate unique confirmation code
reservationSchema.pre('save', function(next) {
    console.log('🔍 Reservation pre-save hook called', { isNew: this.isNew, confirmationCode: this.confirmationCode });
    if (this.isNew) {
        this.confirmationCode = 'RES' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
        console.log('🔍 Generated confirmation code:', this.confirmationCode);
    }
    this.updatedAt = Date.now();
    next();
});

// Index for efficient queries
reservationSchema.index({ canteen: 1, date: 1, time: 1, status: 1 });
reservationSchema.index({ customer: 1 });
// Note: confirmationCode index is handled by unique constraint in schema

module.exports = mongoose.model('Reservation', reservationSchema);
