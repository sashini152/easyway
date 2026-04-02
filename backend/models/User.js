const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        required: true,
        enum: ['super_admin', 'shop_owner', 'user'],
        default: 'user'
    },
    assignedCanteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Canteen',
        default: null // Only for shop owners
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    avatar: {
        type: String,
        default: 'https://ui-avatars.com/api/?name=User&background=random'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get user profile without sensitive info
userSchema.methods.getProfile = function() {
    const userObj = this.toObject();
    delete userObj.password;
    return userObj;
};

// Check if user is super admin
userSchema.methods.isSuperAdmin = function() {
    return this.role === 'super_admin';
};

// Check if user is shop owner
userSchema.methods.isShopOwner = function() {
    return this.role === 'shop_owner';
};

// Check if user is regular user
userSchema.methods.isUser = function() {
    return this.role === 'user';
};

// Check if user owns the canteen
userSchema.methods.ownsCanteen = function(canteenId) {
    return this.assignedCanteen && this.assignedCanteen.toString() === canteenId.toString();
};

module.exports = mongoose.model('User', userSchema);
