const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Canteen name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    assignedShopOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    operatingHours: {
        open: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: 'Please provide a valid time format (HH:MM)'
            }
        },
        close: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: 'Please provide a valid time format (HH:MM)'
            }
        }
    },
    contact: {
        phone: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^[+]?[\d\s-()]+$/.test(v);
                },
                message: 'Please provide a valid phone number'
            }
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        }
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            trim: true
        }
    },
    facilities: [{
        type: String,
        enum: ['WiFi', 'Air Conditioning', 'Seating Area', 'Parking', 'Wheelchair Accessible', 'Delivery', 'Takeaway']
    }],
    menu: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts']
        },
        description: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v) || /^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
                },
                message: 'Please provide a valid image URL'
            }
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for better search performance
canteenSchema.index({ name: 'text', location: 'text', description: 'text' });

// Update average rating when new review is added
canteenSchema.methods.updateRating = function() {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
        this.totalReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = totalRating / this.reviews.length;
        this.totalReviews = this.reviews.length;
    }
    return this.save();
};

// Check if canteen is open
canteenSchema.methods.isOpen = function() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const openTime = this.operatingHours.open.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m), 0);
    const closeTime = this.operatingHours.close.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m), 0);
    
    return currentTime >= openTime && currentTime <= closeTime;
};

// Get canteen details for public view
canteenSchema.methods.getPublicDetails = function() {
    const canteenObj = this.toObject();
    // Remove sensitive information for public view
    delete canteenObj.createdBy;
    return canteenObj;
};

module.exports = mongoose.model('Canteen', canteenSchema);
