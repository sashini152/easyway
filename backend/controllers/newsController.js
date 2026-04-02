const News = require('../models/News');

// Create a new news article
exports.createNews = async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content,
            author,
            category,
            image,
            status,
            featured,
            tags,
            seo
        } = req.body;

        const newNews = new News({
            title,
            excerpt,
            content,
            author,
            category,
            image,
            status,
            featured,
            tags,
            seo
        });

        const savedNews = await newNews.save();

        res.status(201).json({
            success: true,
            message: 'News article created successfully',
            data: savedNews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating news article',
            error: error.message
        });
    }
};

// Get all news articles
exports.getAllNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status } = req.query;
        
        let query = {};
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (category) {
            query.category = category;
        }
        
        if (status) {
            query.status = status;
        }

        const news = await News.find(query)
            .populate('comments')
            .populate('likes')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await News.countDocuments(query);

        res.status(200).json({
            success: true,
            data: news,
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
            message: 'Error fetching news',
            error: error.message
        });
    }
};

// Get news article by ID
exports.getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('comments')
            .populate('likes');

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching news article',
            error: error.message
        });
    }
};

// Update news article
exports.updateNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News article not found'
            });
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'News article updated successfully',
            data: updatedNews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating news article',
            error: error.message
        });
    }
};

// Delete news article
exports.deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (!news) {
            return res.status(404).json({
                success: false,
                message: 'News article not found'
            });
        }

        await News.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'News article deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting news article',
            error: error.message
        });
    }
};

// Increment views
exports.incrementViews = async (req, res) => {
    try {
        const news = await News.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } }
        );

        res.status(200).json({
            success: true,
            message: 'Views incremented successfully',
            data: news
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error incrementing views',
            error: error.message
        });
    }
};
