const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const auth = require('../middleware/auth');

// Get all offers
router.get('/', offerController.getAllOffers);

// Get offer by ID
router.get('/:id', offerController.getOfferById);

// Create new offer (protected route)
router.post('/', auth.authenticate, offerController.createOffer);

// Update offer (protected route)
router.put('/:id', auth.authenticate, offerController.updateOffer);

// Delete offer (protected route)
router.delete('/:id', auth.authenticate, offerController.deleteOffer);

// Increment click count (public route)
router.post('/:id/clicks', offerController.incrementClicks);

module.exports = router;
