const Canteen = require('../models/Canteen');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Create a new canteen (Super Admin only)
const createCanteen = async (req, res) => {
    try {
        const {
            name,
            location,
            description,
            image,
            assignedShopOwner,
            status = 'active',
            operatingHours,
            contact,
            address,
            facilities,
            menu
        } = req.body;

        // Validate required fields
        if (!name || !location || !description || !image) {
            return res.status(400).json({
                success: false,
                message: 'Name, location, description, and image are required'
            });
        }

        // Validate operating hours
        if (!operatingHours || !operatingHours.open || !operatingHours.close) {
            return res.status(400).json({
                success: false,
                message: 'Operating hours (open and close) are required'
            });
        }

        // Validate contact information
        if (!contact || !contact.phone) {
            return res.status(400).json({
                success: false,
                message: 'Contact phone number is required'
            });
        }

        // Validate address
        if (!address || !address.street || !address.city) {
            return res.status(400).json({
                success: false,
                message: 'Address (street and city) is required'
            });
        }

        // Check if assigned shop owner exists and has correct role
        if (assignedShopOwner) {
            const shopOwner = await User.findById(assignedShopOwner);
            if (!shopOwner) {
                return res.status(400).json({
                    success: false,
                    message: 'Assigned shop owner not found'
                });
            }

            if (shopOwner.role !== 'shop_owner') {
                return res.status(400).json({
                    success: false,
                    message: 'Assigned user must be a shop owner'
                });
            }

            // Check if shop owner is already assigned to another canteen
            if (shopOwner.assignedCanteen) {
                return res.status(400).json({
                    success: false,
                    message: 'This shop owner is already assigned to another canteen'
                });
            }
        }

        // Create new canteen
        const newCanteen = new Canteen({
            name,
            location,
            description,
            image,
            assignedShopOwner,
            status,
            operatingHours,
            contact,
            address,
            facilities: facilities || [],
            menu: menu || [],
            createdBy: req.user._id
        });

        const savedCanteen = await newCanteen.save();

        // If shop owner is assigned, update their assignedCanteen field
        if (assignedShopOwner) {
            await User.findByIdAndUpdate(assignedShopOwner, {
                assignedCanteen: savedCanteen._id
            });
        }

        // Populate the assigned shop owner info
        await savedCanteen.populate('assignedShopOwner', 'name email phone');
        await savedCanteen.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Canteen created successfully',
            data: savedCanteen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating canteen',
            error: error.message
        });
    }
};

// Get all canteens (Public access)
const getAllCanteens = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, location } = req.query;
        
        let query = { status: 'active' }; // Only show active canteens to public
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (status) {
            query.status = status;
        }
        
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const canteens = await Canteen.find(query)
            .populate('assignedShopOwner', 'name phone')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Canteen.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                canteens: canteens.map(canteen => canteen.getPublicDetails()),
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching canteens',
            error: error.message
        });
    }
};

// Get canteen by ID (Public access)
const getCanteenById = async (req, res) => {
    try {
        const canteen = await Canteen.findById(req.params.id)
            .populate('assignedShopOwner', 'name phone')
            .populate('reviews.user', 'name avatar')
            .populate('menu', 'name price category isAvailable');

        if (!canteen) {
            return res.status(404).json({
                success: false,
                message: 'Canteen not found'
            });
        }

        res.status(200).json({
            success: true,
            data: canteen.getPublicDetails()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching canteen',
            error: error.message
        });
    }
};

// Update canteen (Super Admin or assigned Shop Owner)
const updateCanteen = async (req, res) => {
    try {
        const canteen = await Canteen.findById(req.params.id);

        if (!canteen) {
            return res.status(404).json({
                success: false,
                message: 'Canteen not found'
            });
        }

        // Check permissions
        if (req.user.role === 'shop_owner') {
            if (!canteen.assignedShopOwner || canteen.assignedShopOwner.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. You can only update your assigned canteen'
                });
            }
        }

        const updates = req.body;

        // If updating assigned shop owner, handle the reassignment
        if (updates.assignedShopOwner && updates.assignedShopOwner !== canteen.assignedShopOwner?.toString()) {
            // Remove assignment from previous owner
            if (canteen.assignedShopOwner) {
                await User.findByIdAndUpdate(canteen.assignedShopOwner, { assignedCanteen: null });
            }

            // Assign to new owner
            const newOwner = await User.findById(updates.assignedShopOwner);
            if (!newOwner || newOwner.role !== 'shop_owner') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid shop owner assignment'
                });
            }

            // Check if new owner is already assigned
            if (newOwner.assignedCanteen) {
                return res.status(400).json({
                    success: false,
                    message: 'This shop owner is already assigned to another canteen'
                });
            }

            await User.findByIdAndUpdate(updates.assignedShopOwner, {
                assignedCanteen: canteen._id
            });
        }

        const updatedCanteen = await Canteen.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).populate('assignedShopOwner', 'name phone');

        res.status(200).json({
            success: true,
            message: 'Canteen updated successfully',
            data: updatedCanteen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating canteen',
            error: error.message
        });
    }
};

// Delete canteen (Super Admin only)
const deleteCanteen = async (req, res) => {
    try {
        const canteen = await Canteen.findById(req.params.id);

        if (!canteen) {
            return res.status(404).json({
                success: false,
                message: 'Canteen not found'
            });
        }

        // Remove assignment from shop owner
        if (canteen.assignedShopOwner) {
            await User.findByIdAndUpdate(canteen.assignedShopOwner, { assignedCanteen: null });
        }

        await Canteen.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Canteen deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting canteen',
            error: error.message
        });
    }
};

// Get canteens for Super Admin (all canteens with full details)
const getAdminCanteens = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status } = req.query;
        
        let query = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (status) {
            query.status = status;
        }

        const canteens = await Canteen.find(query)
            .populate('assignedShopOwner', 'name email phone')
            .populate('createdBy', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Canteen.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                canteens,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching canteens',
            error: error.message
        });
    }
};

// Get canteen for Shop Owner (only their assigned canteen)
const getShopOwnerCanteen = async (req, res) => {
    try {
        if (!req.user.assignedCanteen) {
            return res.status(404).json({
                success: false,
                message: 'No canteen assigned to you'
            });
        }

        const canteen = await Canteen.findById(req.user.assignedCanteen)
            .populate('assignedShopOwner', 'name phone')
            .populate('reviews.user', 'name avatar');

        if (!canteen) {
            return res.status(404).json({
                success: false,
                message: 'Assigned canteen not found'
            });
        }

        res.status(200).json({
            success: true,
            data: canteen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching canteen',
            error: error.message
        });
    }
};

// Create menu item for canteen
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const canteenId = req.params.id;

        // Validate required fields
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }

        // Check if user owns this canteen
        const canteen = await Canteen.findById(canteenId);
        if (!canteen || canteen.assignedShopOwner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only add menu items to your assigned canteen'
            });
        }

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category: category || 'Main Course',
            image,
            canteen: canteenId
        });

        await menuItem.save();

        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating menu item',
            error: error.message
        });
    }
};

// Update menu item
const updateMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const { itemId } = req.params;

        const menuItem = await MenuItem.findById(itemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Check if user owns this canteen
        const canteen = await Canteen.findById(menuItem.canteen);
        if (!canteen || canteen.assignedShopOwner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update menu items in your assigned canteen'
            });
        }

        // Update menu item
        Object.assign(menuItem, { name, description, price, category, image });
        await menuItem.save();

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating menu item',
            error: error.message
        });
    }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const menuItem = await MenuItem.findById(itemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Check if user owns this canteen
        const canteen = await Canteen.findById(menuItem.canteen);
        if (!canteen || canteen.assignedShopOwner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete menu items from your assigned canteen'
            });
        }

        await MenuItem.findByIdAndDelete(itemId);

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting menu item',
            error: error.message
        });
    }
};

// Add review to canteen
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const canteenId = req.params.id;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const canteen = await Canteen.findById(canteenId);
        if (!canteen) {
            return res.status(404).json({
                success: false,
                message: 'Canteen not found'
            });
        }

        // Check if user already reviewed
        const existingReview = canteen.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this canteen'
            });
        }

        // Add new review
        canteen.reviews.push({
            user: req.user._id,
            rating,
            comment
        });

        // Update rating
        await canteen.updateRating();

        await canteen.populate('reviews.user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: canteen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
};

module.exports = {
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
};
