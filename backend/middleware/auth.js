const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is valid but user not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Server error during authentication.',
                error: error.message
            });
        }
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

// Super Admin only middleware
const superAdminOnly = authorize('super_admin');

// Shop Owner only middleware
const shopOwnerOnly = authorize('shop_owner');

// User only middleware
const userOnly = authorize('user');

// Super Admin or Shop Owner middleware
const adminOrOwner = authorize('super_admin', 'shop_owner');

// Super Admin or User middleware
const adminOrUser = authorize('super_admin', 'user');

// All authenticated users middleware
const allAuthenticated = authorize('super_admin', 'shop_owner', 'user');

// Check if user owns the canteen (for shop owners)
const canteenOwner = async (req, res, next) => {
    try {
        const canteenId = req.params.id || req.params.canteenId;
        
        if (req.user.role === 'super_admin') {
            return next(); // Super admin can access any canteen
        }

        if (req.user.role === 'shop_owner') {
            // Check if user owns this canteen
            if (!req.user.assignedCanteen || req.user.assignedCanteen.toString() !== canteenId) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only manage your assigned canteen.'
                });
            }
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied. Insufficient permissions.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error during authorization.',
            error: error.message
        });
    }
};

// Check if user can edit the article
const articleOwner = async (req, res, next) => {
    try {
        const articleId = req.params.id || req.params.articleId;
        const Article = require('../models/Article');
        
        const article = await Article.findById(articleId);
        
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found.'
            });
        }

        if (req.user.role === 'super_admin') {
            return next(); // Super admin can edit any article
        }

        // Check if user is the author of the article
        if (article.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own articles.'
            });
        }

        req.article = article;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error during authorization.',
            error: error.message
        });
    }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // No token, continue without authentication
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user && user.isActive) {
            req.user = user;
        }
        
        next();
    } catch (error) {
        // If token is invalid, continue without authentication
        next();
    }
};

module.exports = {
    authenticate,
    authorize,
    superAdminOnly,
    shopOwnerOnly,
    userOnly,
    adminOrOwner,
    adminOrUser,
    allAuthenticated,
    canteenOwner,
    articleOwner,
    optionalAuth
};
