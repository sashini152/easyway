const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth');

// Get all news articles
router.get('/', newsController.getAllNews);

// Get news article by ID
router.get('/:id', newsController.getNewsById);

// Create new news article (protected route)
router.post('/', auth.authenticate, newsController.createNews);

// Update news article (protected route)
router.put('/:id', auth.authenticate, newsController.updateNews);

// Delete news article (protected route)
router.delete('/:id', auth.authenticate, newsController.deleteNews);

// Increment views (public route)
router.post('/:id/views', newsController.incrementViews);

module.exports = router;
