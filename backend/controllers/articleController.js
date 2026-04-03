const Article = require('../models/Article');

// Create a new article (Users can submit, Super Admin can create)
const createArticle = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            category = 'Food Review',
            tags,
            image,
            status = 'pending'
        } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot exceed 200 characters'
            });
        }

        if (content.length < 50) {
            return res.status(400).json({
                success: false,
                message: 'Content must be at least 50 characters long'
            });
        }

        // Users can only submit articles with 'pending' status
        if (req.user.role === 'user' && status !== 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Users can only submit articles for review'
            });
        }

        // Super Admin can create articles with any status
        if (req.user.role === 'super_admin') {
            // If status is published, set publishedAt
            const articleData = {
                title,
                content,
                excerpt,
                category,
                tags: tags || [],
                image,
                status,
                author: req.user._id,
                publishedAt: status === 'published' ? new Date() : null
            };

            const newArticle = new Article(articleData);
            const savedArticle = await newArticle.save();
            
            await savedArticle.populate('author', 'name email avatar');

            res.status(201).json({
                success: true,
                message: 'Article created successfully',
                data: savedArticle
            });
        } else {
            // User submission
            const articleData = {
                title,
                content,
                excerpt,
                category,
                tags: tags || [],
                image,
                status: 'pending',
                author: req.user._id
            };

            const newArticle = new Article(articleData);
            const savedArticle = await newArticle.save();
            
            await savedArticle.populate('author', 'name email avatar');

            res.status(201).json({
                success: true,
                message: 'Article submitted for review successfully',
                data: savedArticle
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating article',
            error: error.message
        });
    }
};

// Get all articles (Public access)
const getAllArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, category, status, author } = req.query;
        
        let query = {};
        
        // Different queries based on user role
        if (req.user && req.user.role === 'super_admin') {
            // Super Admin can see all articles
            if (status) query.status = status;
        } else {
            // Regular users and public can only see published articles
            query.status = 'published';
        }
        
        if (category) {
            query.category = category;
        }
        
        if (author) {
            query.author = author;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const articles = await Article.find(query)
            .populate('author', 'name email avatar')
            .populate('comments.user', 'name avatar')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ publishedAt: -1, createdAt: -1 });

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                articles,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching articles',
            error: error.message
        });
    }
};

// Get article by ID
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('author', 'name email avatar')
            .populate('comments.user', 'name avatar')
            .populate('likes', 'name email avatar');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check permissions
        if (req.user.role !== 'super_admin') {
            // Regular users can only see published articles
            if (article.status !== 'published') {
                return res.status(403).json({
                    success: false,
                    message: 'Article not available'
                });
            }
        }

        // Increment view count
        article.getPublicDetails();

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching article',
            error: error.message
        });
    }
};

// Update article (Super Admin or Author)
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Check permissions
        if (!article.canEdit(req.user._id, req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only edit your own articles'
            });
        }

        const updates = req.body;

        // Users can only update certain fields and status must remain pending
        if (req.user.role === 'user') {
            const allowedFields = ['title', 'content', 'excerpt', 'category', 'tags', 'image'];
            const updateKeys = Object.keys(updates);
            
            for (const key of updateKeys) {
                if (!allowedFields.includes(key)) {
                    return res.status(403).json({
                        success: false,
                        message: `Users cannot update ${key} field`
                    });
                }
            }
            
            updates.status = 'pending'; // Always keep as pending for user updates
        }

        // Super Admin can update status and rejection reason
        if (req.user.role === 'super_admin') {
            // If status is being changed to published, set publishedAt
            if (updates.status === 'published' && article.status !== 'published') {
                updates.publishedAt = new Date();
            }
            
            // If status is being changed to rejected, require rejection reason
            if (updates.status === 'rejected' && !updates.rejectionReason) {
                return res.status(400).json({
                    success: false,
                    message: 'Rejection reason is required when rejecting an article'
                });
            }
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).populate('author', 'name email avatar')
        .populate('comments.user', 'name avatar');

        res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            data: updatedArticle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating article',
            error: error.message
        });
    }
};

// Delete article (Super Admin only)
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Only Super Admin can delete articles
        if (!article.canDelete(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Only Super Admin can delete articles'
            });
        }

        await Article.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting article',
            error: error.message
        });
    }
};

// Get articles for dashboard (Super Admin - pending articles, User - their own articles)
const getDashboardArticles = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        let query = {};
        
        if (req.user.role === 'super_admin') {
            // Super Admin sees pending articles that need review
            query.status = 'pending';
        } else {
            // Users see their own articles
            query.author = req.user._id;
        }

        const articles = await Article.find(query)
            .populate('author', 'name email avatar')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                articles,
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
            message: 'Error fetching dashboard articles',
            error: error.message
        });
    }
};

// Like/unlike article
const toggleLike = async (req, res) => {
    try {
        const articleId = req.params.id;
        const userId = req.user._id;

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Only published articles can be liked
        if (article.status !== 'published') {
            return res.status(400).json({
                success: false,
                message: 'Only published articles can be liked'
            });
        }

        const likeIndex = article.likes.findIndex(
            like => like.toString() === userId.toString()
        );

        if (likeIndex > -1) {
            // Unlike
            article.likes.splice(likeIndex, 1);
        } else {
            // Like
            article.likes.push(userId);
        }

        await article.save();

        res.status(200).json({
            success: true,
            message: likeIndex > -1 ? 'Article unliked' : 'Article liked',
            data: {
                likesCount: article.likes.length,
                isLiked: likeIndex === -1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling like',
            error: error.message
        });
    }
};

// Add comment to article
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const articleId = req.params.id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        if (content.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot exceed 500 characters'
            });
        }

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        // Only published articles can be commented on
        if (article.status !== 'published') {
            return res.status(400).json({
                success: false,
                message: 'Only published articles can be commented on'
            });
        }

        // Add new comment
        article.comments.push({
            user: req.user._id,
            content
        });

        await article.save();

        await article.populate('comments.user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: article
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding comment',
            error: error.message
        });
    }
};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getDashboardArticles,
    toggleLike,
    addComment
};
