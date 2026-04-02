const express = require('express');
const router = express.Router();
const {
    createCanteen,
    getAllCanteens,
    getCanteenById,
    updateCanteen,
    deleteCanteen,
    getAdminCanteens,
    getShopOwnerCanteen,
    addReview
} = require('../controllers/canteenController');
const { 
    authenticate, 
    superAdminOnly, 
    shopOwnerOnly, 
    adminOrOwner,
    canteenOwner,
    allAuthenticated 
} = require('../middleware/auth');

// Public routes - anyone can view canteens
router.get('/', getAllCanteens);
router.get('/:id', getCanteenById);

// Authenticated users can add reviews
router.post('/:id/reviews', authenticate, allAuthenticated, addReview);

// Super Admin routes
router.post('/', authenticate, superAdminOnly, createCanteen);
router.get('/admin/all', authenticate, superAdminOnly, getAdminCanteens);
router.put('/:id', authenticate, canteenOwner, updateCanteen);
router.delete('/:id', authenticate, superAdminOnly, deleteCanteen);

// Shop Owner routes - only their assigned canteen
router.get('/owner/my-canteen', authenticate, shopOwnerOnly, getShopOwnerCanteen);

module.exports = router;
