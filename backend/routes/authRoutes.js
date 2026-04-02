const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    assignCanteen,
    toggleUserStatus
} = require('../controllers/authController');
const { authenticate, superAdminOnly } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes - all authenticated users
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

// Super Admin only routes
router.get('/users', authenticate, superAdminOnly, getAllUsers);
router.post('/assign-canteen', authenticate, superAdminOnly, assignCanteen);
router.patch('/users/:id/toggle-status', authenticate, superAdminOnly, toggleUserStatus);

module.exports = router;
