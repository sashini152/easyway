const express = require('express');
const router = express.Router();
const {
    createReservation,
    getReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    getAvailableTimeSlots
} = require('../controllers/reservationController');
const { authenticate, superAdminOnly, shopOwnerOnly, allAuthenticated } = require('../middleware/auth');

// Public routes - customers can create reservations
router.post('/', createReservation);

// Get available time slots (public)
router.get('/available-slots', getAvailableTimeSlots);

// Protected routes - require authentication
router.get('/', authenticate, getReservations);
router.get('/:id', authenticate, getReservationById);

// Shop Owner and Super Admin routes
router.patch('/:id/status', authenticate, allAuthenticated, updateReservationStatus);
router.delete('/:id', authenticate, allAuthenticated, deleteReservation);

module.exports = router;
