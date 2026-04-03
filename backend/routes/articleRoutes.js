const express = require('express');
const router = express.Router();
const {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getDashboardArticles,
    toggleLike,
    addComment
} = require('../controllers/articleController');
const { 
    authenticate, 
    superAdminOnly, 
    userOnly,
    adminOrUser,
    articleOwner,
    allAuthenticated 
} = require('../middleware/auth');

// Authenticated routes - users can view articles based on their role
router.get('/', authenticate, getAllArticles);
router.get('/:id', authenticate, getArticleById);

// Authenticated users can create articles (users submit for review)
router.post('/', authenticate, createArticle);

// Authenticated users can like and comment on published articles
router.post('/:id/like', authenticate, allAuthenticated, toggleLike);
router.post('/:id/comment', authenticate, allAuthenticated, addComment);

// Dashboard routes - different based on role
router.get('/dashboard', authenticate, getDashboardArticles);

// Update article - Super Admin or Author
router.put('/:id', authenticate, updateArticle);

// Delete article - Super Admin only
router.delete('/:id', authenticate, deleteArticle);

module.exports = router;
