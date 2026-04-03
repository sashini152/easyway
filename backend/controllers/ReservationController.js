const Reservation = require('../models/Reservation');
const Canteen = require('../models/Canteen');

// @desc    Create new reservation
const createReservation = async (req, res) => {
    try {
        const {
            customer: { name, email, phone },
            canteen,
            date,
            time,
            partySize,
            specialRequests
        } = req.body;

        // Validate canteen exists
        const canteenExists = await Canteen.findById(canteen);
        if (!canteenExists) {
            return res.status(404).json({
                success: false,
                message: 'Canteen not found'
            });
        }

        // Check if reservation already exists for same time slot
        const existingReservation = await Reservation.findOne({
            canteen,
            date: new Date(date),
            time,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingReservation) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked'
            });
        }

        // Create reservation
        const reservation = new Reservation({
            customer: { name, email, phone },
            canteen,
            date: new Date(date),
            time,
            partySize,
            specialRequests
        });

        console.log('🔍 createReservation: About to save reservation', reservation);
        const savedReservation = await reservation.save();
        console.log('🔍 createReservation: Reservation saved successfully', savedReservation._id);

        // Populate canteen details
        await savedReservation.populate('canteen', 'name location');
        console.log('🔍 createReservation: Populated canteen details');

        res.status(201).json({
            success: true,
            message: 'Reservation created successfully',
            data: savedReservation
        });
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating reservation',
            error: error.message
        });
    }
};

// @desc    Get all reservations (for admin/shop owner)
const getReservations = async (req, res) => {
    try {
        const { canteenId, date, status } = req.query;
        
        console.log('🔍 getReservations: Called', { 
            userRole: req.user.role, 
            userEmail: req.user.email, 
            userId: req.user._id,
            canteenId, 
            date, 
            status 
        });
        
        let filter = {};
        
        // Role-based filtering
        if (req.user.role === 'shop_owner') {
            // Shop owners can only see their canteen's reservations
            filter.canteen = req.user.assignedCanteen;
            console.log('🔍 getReservations: Shop owner filter', { assignedCanteen: req.user.assignedCanteen });
        } else if (req.user.role === 'user') {
            // Regular users can see their own reservations, filtered by canteen if specified
            const userFilter = {
                $or: [
                    { 'customer.email': req.user.email },
                    { 'customer.phone': req.user.phone }
                ]
            };
            
            if (canteenId) {
                // If user selected a specific canteen, add it to the filter
                filter.$and = [
                    userFilter,
                    { canteen: canteenId }
                ];
                console.log('🔍 getReservations: User filter with canteen', { canteenId, userEmail: req.user.email });
            } else {
                // No canteen selected, show all their reservations
                Object.assign(filter, userFilter);
                console.log('🔍 getReservations: User filter all reservations', { userEmail: req.user.email });
            }
        } else if (canteenId) {
            // Super admin can filter by canteen if specified
            filter.canteen = canteenId;
            console.log('🔍 getReservations: Super admin filter by canteen', { canteenId });
        }
        // Super admin sees all reservations if no filters applied
        
        if (date) {
            filter.date = {
                $gte: new Date(date),
                $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
            };
        }
        
        if (status) {
            filter.status = status;
        }

        console.log('🔍 getReservations: Final filter', filter);

        const reservations = await Reservation.find(filter)
            .populate('canteen', 'name location')
            .sort({ date: 1, time: 1 });

        console.log('🔍 getReservations: Found reservations', reservations.length);

        res.status(200).json({
            success: true,
            data: reservations
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reservations',
            error: error.message
        });
    }
};

// @desc    Get reservation by ID
const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('canteen', 'name location contact');

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Check permissions
        if (req.user.role === 'shop_owner') {
            if (reservation.canteen._id.toString() !== req.user.assignedCanteen.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to view this reservation'
                });
            }
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reservation',
            error: error.message
        });
    }
};

// @desc    Update reservation status
const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Check permissions
        if (req.user.role === 'shop_owner') {
            if (reservation.canteen.toString() !== req.user.assignedCanteen.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this reservation'
                });
            }
        }

        reservation.status = status;
        await reservation.save();

        await reservation.populate('canteen', 'name location');

        res.status(200).json({
            success: true,
            message: `Reservation ${status} successfully`,
            data: reservation
        });
    } catch (error) {
        console.error('Error updating reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating reservation',
            error: error.message
        });
    }
};

// @desc    Cancel/Delete reservation
const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        // Check permissions
        if (req.user.role === 'shop_owner') {
            if (reservation.canteen.toString() !== req.user.assignedCanteen.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this reservation'
                });
            }
        }

        await Reservation.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Reservation cancelled successfully'
        });
    } catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting reservation',
            error: error.message
        });
    }
};

// @desc    Get available time slots for a specific date
const getAvailableTimeSlots = async (req, res) => {
    try {
        const { canteenId, date } = req.query;

        if (!canteenId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Canteen ID and date are required'
            });
        }

        // Validate canteen exists
        const canteen = await Canteen.findById(canteenId);
        if (!canteen) {
            return res.status(404).json({
                success: false,
                message: 'Canteen not found'
            });
        }

        // Generate time slots (e.g., every 30 minutes from 8 AM to 10 PM)
        const timeSlots = [];
        const openingTime = 8; // 8 AM
        const closingTime = 22; // 10 PM
        
        for (let hour = openingTime; hour < closingTime; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                timeSlots.push(time);
            }
        }

        // Get existing reservations for the date
        const existingReservations = await Reservation.find({
            canteen: canteenId,
            date: new Date(date),
            status: { $in: ['pending', 'confirmed'] }
        }).select('time');

        const bookedTimes = existingReservations.map(res => res.time);

        // Filter available time slots
        const availableSlots = timeSlots.filter(slot => !bookedTimes.includes(slot));

        res.status(200).json({
            success: true,
            data: {
                availableSlots,
                bookedTimes,
                allSlots: timeSlots
            }
        });
    } catch (error) {
        console.error('Error fetching available time slots:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching available time slots',
            error: error.message
        });
    }
};

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    getAvailableTimeSlots
};
