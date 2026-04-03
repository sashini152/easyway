const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Article title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Article content is required'],
        trim: true,
        minlength: [50, 'Content must be at least 50 characters long']
    },
    excerpt: {
        type: String,
        trim: true,
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    canteen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Canteen'
    },
    canteenName: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['draft', 'pending', 'published', 'rejected'],
        default: 'pending'
    },
    category: {
        type: String,
        required: true,
        enum: ['Food Review', 'Campus Life', 'Health Tips', 'Events', 'News', 'Other'],
        default: 'Food Review'
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag cannot exceed 30 characters']
    }],
    image: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Allow empty image
                // Accept HTTP/HTTPS URLs
                if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)) return true;
                // Accept relative upload paths
                if (/^\/uploads\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v)) return true;
                // Accept base64 images
                if (/^data:image\/(jpg|jpeg|png|gif|webp);base64,/.test(v)) return true;
                return false;
            },
            message: 'Please provide a valid image URL or base64 image'
        }
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    publishedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        trim: true,
        maxlength: [500, 'Rejection reason cannot exceed 500 characters']
    },
    featured: {
        type: Boolean,
        default: false
    },
    seo: {
        metaTitle: {
            type: String,
            maxlength: [60, 'Meta title cannot exceed 60 characters']
        },
        metaDescription: {
            type: String,
            maxlength: [160, 'Meta description cannot exceed 160 characters']
        },
        keywords: [String]
    }
}, {
    timestamps: true
});

// Index for better search performance
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Generate excerpt from content if not provided
articleSchema.pre('save', function(next) {
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 150) + '...';
    }
    
    // Set publishedAt when status changes to published
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    
    next();
});

// Get article details for public view
articleSchema.methods.getPublicDetails = function() {
    const articleObj = this.toObject();
    // Add view count increment
    this.views += 1;
    this.save();
    return articleObj;
};

// Check if user can edit this article
articleSchema.methods.canEdit = function(userId, userRole) {
    // Super admin can edit any article
    if (userRole === 'super_admin') return true;
    
    // Author can edit their own articles
    if (this.author.toString() === userId.toString()) return true;
    
    // Shop owner can edit articles associated with their canteen
    // This will be checked in the controller with proper canteen verification
    
    return false;
};

// Check if user can delete this article
articleSchema.methods.canDelete = function(userRole) {
    // Only super admin can delete articles
    return userRole === 'super_admin';
};

module.exports = mongoose.model('Article', articleSchema);
