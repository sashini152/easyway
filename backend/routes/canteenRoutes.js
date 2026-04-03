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
    addReview,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/canteenController');
const MenuItem = require('../models/MenuItem');
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
router.get('/:id/menu-items', authenticate, shopOwnerOnly, async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ canteen: req.params.id });
        res.status(200).json({
            success: true,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching menu items',
            error: error.message
        });
    }
});

// Menu Item routes - shop owner can manage their canteen menu
router.post('/:id/menu-items', authenticate, shopOwnerOnly, createMenuItem);
router.put('/menu-items/:itemId', authenticate, shopOwnerOnly, updateMenuItem);
router.delete('/menu-items/:itemId', authenticate, shopOwnerOnly, deleteMenuItem);

module.exports = router;
