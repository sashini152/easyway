const Offer = require('../models/Offer');

// Create a new offer
exports.createOffer = async (req, res) => {
    try {
        const {
            title,
            description,
            discount,
            shopName,
            shop,
            validUntil,
            category,
            status,
            usageLimit,
            minOrder,
            maxDiscount,
            applicableItems,
            exclusions,
            color,
            terms,
            priority,
            redemptions
        } = req.body;

        const newOffer = new Offer({
            title,
            description,
            discount,
            shopName,
            shop,
            validUntil,
            category,
            status,
            usageLimit,
            minOrder,
            maxDiscount,
            applicableItems,
            exclusions,
            color,
            terms,
            priority,
            redemptions
        });

        const savedOffer = await newOffer.save();

        res.status(201).json({
            success: true,
            message: 'Offer created successfully',
            data: savedOffer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating offer',
            error: error.message
        });
    }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status, shop } = req.query;
        
        let query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { shopName: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (category) {
            query.category = category;
        }
        
        if (status) {
            query.status = status;
        }
        
        if (shop) {
            query.shop = shop;
        }

        const offers = await Offer.find(query)
            .populate('shop')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ priority: -1, createdAt: -1 });

        const total = await Offer.countDocuments(query);

        res.status(200).json({
            success: true,
            data: offers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching offers',
            error: error.message
        });
    }
};

// Get offer by ID
exports.getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id).populate('shop');

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: offer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching offer',
            error: error.message
        });
    }
};

// Update offer
exports.updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        const updatedOffer = await Offer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Offer updated successfully',
            data: updatedOffer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating offer',
            error: error.message
        });
    }
};

// Delete offer
exports.deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: 'Offer not found'
            });
        }

        await Offer.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Offer deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting offer',
            error: error.message
        });
    }
};

// Increment click count
exports.incrementClicks = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(
            req.params.id,
            { $inc: { clickCount: 1 } }
        );

        res.status(200).json({
            success: true,
            message: 'Click count incremented successfully',
            data: offer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error incrementing clicks',
            error: error.message
        });
    }
};
