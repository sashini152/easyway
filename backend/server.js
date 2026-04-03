const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'], // Allow specific origins including frontend port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting - temporarily disabled for development
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
//     message: 'Too many requests from this IP, please try again later.',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// Apply rate limiting to all routes except auth routes
// app.use('/api/', limiter);

// Auth routes have more lenient rate limiting
// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 2000, // higher limit for auth routes
//     message: 'Too many auth attempts, please try again later.',
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
const authRoutes = require('./routes/authRoutes');
const canteenRoutes = require('./routes/canteenRoutes');
const articleRoutes = require('./routes/articleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/reservations', reservationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors
        });
    }
    
    // Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
    
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
