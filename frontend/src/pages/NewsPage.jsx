import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    CalendarIcon, 
    EyeIcon, 
    MessageCircleIcon, 
    UserIcon,
    SearchIcon,
    FilterIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    FileTextIcon,
    TrendingUpIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch news from API
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/news');
                const data = await response.json();
                
                if (data.success) {
                    setNews(data.data);
                    setFilteredNews(data.data);
                } else {
                    console.error('Failed to fetch news:', data.message);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        let filtered = news;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        setFilteredNews(filtered);
    }, [searchTerm, categoryFilter, news]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'draft':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'archived':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'News':
                return 'bg-blue-100 text-blue-700';
            case 'Health':
                return 'bg-green-100 text-green-700';
            case 'Update':
                return 'bg-orange-100 text-orange-700';
            case 'Feedback':
                return 'bg-purple-100 text-purple-700';
            case 'Event':
                return 'bg-pink-100 text-pink-700';
            case 'Announcement':
                return 'bg-indigo-100 text-indigo-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-surface-600">Loading news...</p>
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
                            <h1 className="text-2xl font-bold text-surface-900">News & Blog Management</h1>
                            <p className="text-surface-600 mt-1">Manage and view all news articles and blog posts</p>
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
                                    <option value="News">News</option>
                                    <option value="Health">Health</option>
                                    <option value="Update">Update</option>
                                    <option value="Feedback">Feedback</option>
                                    <option value="Event">Event</option>
                                    <option value="Announcement">Announcement</option>
                                </select>
                            </div>
                            <Button className="bg-brand-500 hover:bg-brand-600">
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
                        { label: 'Total Articles', value: news.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Published', value: news.filter(n => n.status === 'published').length, color: 'bg-green-50 text-green-700' },
                        { label: 'Draft', value: news.filter(n => n.status === 'draft').length, color: 'bg-yellow-50 text-yellow-700' },
                        { label: 'Total Views', value: news.reduce((sum, n) => sum + n.views, 0).toLocaleString(), color: 'bg-purple-50 text-purple-700' },
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

                {/* News Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Article Details</span>
                            <span className="text-sm font-normal text-surface-600">
                                Showing {filteredNews.length} of {news.length} articles
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-200">
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Article</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Author</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Created</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Views</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Comments</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Likes</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredNews.map((article, index) => (
                                        <motion.tr
                                            key={article.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={article.image}
                                                        alt={article.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-surface-900 max-w-xs truncate">{article.title}</p>
                                                        <p className="text-sm text-surface-500">ID: #{article.id}</p>
                                                        {article.featured && (
                                                            <Badge className="bg-yellow-100 text-yellow-700 mt-1">
                                                                <TrendingUpIcon size={12} className="mr-1" />
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={getCategoryColor(article.category)}>
                                                    {article.category}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{article.author}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-surface-700">
                                                    <CalendarIcon size={16} className="text-surface-400" />
                                                    <span className="text-sm">{new Date(article.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <EyeIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{article.views.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MessageCircleIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{article.comments ? article.comments.length : 0}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUpIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{article.likes ? article.likes.length : 0}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={getStatusColor(article.status)}>
                                                    <span className="capitalize">{article.status}</span>
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm">
                                                        <EditIcon size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                                        <TrashIcon size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NewsPage;
