import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FileTextIcon, 
    PlusIcon, 
    EditIcon, 
    TrashIcon,
    SearchIcon,
    FilterIcon,
    EyeIcon,
    HeartIcon,
    MessageCircleIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    HourglassIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { articleAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserArticleSubmission = () => {
    const { user } = useAuth();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: 'Food Review',
        tags: [],
        image: ''
    });

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        let filtered = articles;

        if (searchTerm) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(article => article.category === categoryFilter);
        }

        setArticles(filtered);
    }, [searchTerm, categoryFilter]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await articleAPI.getDashboardArticles();
            if (response.success) {
                setArticles(response.data.articles);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedArticle) {
                await articleAPI.updateArticle(selectedArticle._id, formData);
            } else {
                await articleAPI.createArticle(formData);
            }
            
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedArticle(null);
            resetForm();
            fetchArticles();
        } catch (error) {
            console.error('Error saving article:', error);
        }
    };

    const handleEdit = (article) => {
        setSelectedArticle(article);
        setFormData({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            category: article.category,
            tags: article.tags || [],
            image: article.image
        });
        setShowEditModal(true);
    };

    const handleDelete = async (articleId) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await articleAPI.deleteArticle(articleId);
                fetchArticles();
            } catch (error) {
                console.error('Error deleting article:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            excerpt: '',
            category: 'Food Review',
            tags: [],
            image: ''
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'draft':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'published':
                return <CheckCircleIcon size={16} />;
            case 'pending':
                return <HourglassIcon size={16} />;
            case 'rejected':
                return <XCircleIcon size={16} />;
            case 'draft':
                return <ClockIcon size={16} />;
            default:
                return <ClockIcon size={16} />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Food Review':
                return 'bg-blue-100 text-blue-700';
            case 'Campus Life':
                return 'bg-green-100 text-green-700';
            case 'Health Tips':
                return 'bg-orange-100 text-orange-700';
            case 'Events':
                return 'bg-purple-100 text-purple-700';
            case 'News':
                return 'bg-red-100 text-red-700';
            case 'Other':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-surface-600">Loading articles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Header */}
            <div className="bg-white border-b border-surface-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-surface-900">My Articles</h1>
                            <p className="text-surface-600 mt-1">Manage and submit articles</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FilterIcon size={20} className="text-surface-400" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Food Review">Food Review</option>
                                    <option value="Campus Life">Campus Life</option>
                                    <option value="Health Tips">Health Tips</option>
                                    <option value="Events">Events</option>
                                    <option value="News">News</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <Button 
                                onClick={() => {
                                    resetForm();
                                    setShowAddModal(true);
                                }}
                                className="bg-brand-500 hover:bg-brand-600"
                            >
                                <PlusIcon size={16} className="mr-2" />
                                New Article
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Articles', value: articles.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Published', value: articles.filter(a => a.status === 'published').length, color: 'bg-green-50 text-green-700' },
                        { label: 'Pending', value: articles.filter(a => a.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
                        { label: 'Total Views', value: articles.reduce((sum, a) => sum + a.views, 0).toLocaleString(), color: 'bg-purple-50 text-purple-700' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 border border-surface-200 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-surface-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.color}`}>
                                    <FileTextIcon size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Articles List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Article Details</span>
                            <span className="text-sm font-normal text-surface-600">
                                Showing {articles.length} articles
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {articles.map((article, index) => (
                                <motion.div
                                    key={article._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border border-surface-200 rounded-lg p-4 hover:bg-surface-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-surface-900 text-lg">{article.title}</h3>
                                                <Badge className={getStatusColor(article.status)}>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(article.status)}
                                                        <span className="capitalize">{article.status}</span>
                                                    </div>
                                                </Badge>
                                                <Badge className={getCategoryColor(article.category)}>
                                                    {article.category}
                                                </Badge>
                                            </div>
                                            
                                            <p className="text-surface-600 mb-3 line-clamp-2">
                                                {article.excerpt || article.content.substring(0, 150) + '...'}
                                            </p>
                                            
                                            <div className="flex items-center gap-4 text-sm text-surface-500">
                                                <div className="flex items-center gap-1">
                                                    <EyeIcon size={14} />
                                                    <span>{article.views}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <HeartIcon size={14} />
                                                    <span>{article.likes?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageCircleIcon size={14} />
                                                    <span>{article.comments?.length || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon size={14} />
                                                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {article.tags.map((tag, tagIndex) => (
                                                        <Badge key={tagIndex} className="bg-surface-100 text-surface-600 text-xs">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {article.status === 'rejected' && article.rejectionReason && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm text-red-700">
                                                        <strong>Rejection Reason:</strong> {article.rejectionReason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 ml-4">
                                            {article.status === 'pending' && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleEdit(article)}
                                                >
                                                    <EditIcon size={14} />
                                                </Button>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDelete(article._id)}
                                            >
                                                <TrashIcon size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold text-surface-900 mb-6">
                            {showAddModal ? 'Submit New Article' : 'Edit Article'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Title *
                                </label>
                                <Input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                    maxLength={200}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                >
                                    <option value="Food Review">Food Review</option>
                                    <option value="Campus Life">Campus Life</option>
                                    <option value="Health Tips">Health Tips</option>
                                    <option value="Events">Events</option>
                                    <option value="News">News</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Excerpt
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                                    rows={3}
                                    maxLength={300}
                                    placeholder="Brief description of your article..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    required
                                    rows={8}
                                    minLength={50}
                                    placeholder="Write your article content here..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Image URL
                                </label>
                                <Input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Tags (comma separated)
                                </label>
                                <Input
                                    type="text"
                                    value={formData.tags.join(', ')}
                                    onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                                    placeholder="food, review, sliit"
                                />
                            </div>
                            
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-700">
                                    <strong>Note:</strong> Your article will be submitted for review. Once approved by the Super Admin, it will be published on the platform.
                                </p>
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-brand-500 hover:bg-brand-600">
                                    {showAddModal ? 'Submit Article' : 'Update Article'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserArticleSubmission;
