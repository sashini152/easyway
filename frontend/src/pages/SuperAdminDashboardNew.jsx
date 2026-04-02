import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, TrendingUp, Shield, Plus, Edit, Trash2, MapPin, Phone, Mail, Clock, FileText, Eye, MessageCircle, Calendar } from "lucide-react";
import { canteenAPI, userAPI } from '../services/api';
import { articleAPI } from '../services/api';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCanteens: 0,
    activeCanteens: 0
  });
  const [canteens, setCanteens] = useState([]);
  const [shopOwners, setShopOwners] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('canteens'); // 'canteens' or 'articles'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showEditArticleModal, setShowEditArticleModal] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '', // For backward compatibility with backend
    address: {
      street: '',
      city: ''
    },
    description: '',
    image: '',
    assignedShopOwner: '',
    status: 'active',
    operatingHours: {
      open: '08:00',
      close: '20:00'
    },
    contact: {
      phone: '',
      email: ''
    }
  });
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Food Review',
    tags: '',
    image: '',
    status: 'pending'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Fetch canteens
      const canteenResponse = await canteenAPI.getAllCanteens();
      if (canteenResponse.success) {
        setCanteens(canteenResponse.data.canteens);
      }

      // Fetch users for stats
      const userResponse = await userAPI.getAllUsers();
      if (userResponse.success) {
        const users = userResponse.data.users;
        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: users.filter(u => u.isActive).length,
          totalCanteens: canteenResponse.data?.canteens?.length || 0,
          activeCanteens: canteenResponse.data?.canteens?.filter(c => c.status === 'active').length || 0
        }));
      }

      // Fetch shop owners for assignment (only if needed and with delay)
      if (shopOwners.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 300));
        try {
          const shopOwnerResponse = await userAPI.getAllUsers({ role: 'shop_owner' });
          if (shopOwnerResponse.success) {
            setShopOwners(shopOwnerResponse.data.users);
          }
        } catch (error) {
          console.log('Shop owners fetch failed, continuing without it');
        }
      }

      // Fetch articles
      const articleResponse = await articleAPI.getAllArticles();
      if (articleResponse.success) {
        const fetchedArticles = articleResponse.data.articles || [];
        setArticles(fetchedArticles);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCanteen = async (e) => {
    e.preventDefault();
    try {
      // Prepare data with proper null handling
      const canteenData = {
        ...formData,
        assignedShopOwner: formData.assignedShopOwner || null, // Convert empty string to null
      };
      
      await canteenAPI.createCanteen(canteenData);
      setShowAddModal(false);
      resetForm();
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding canteen:', error);
      alert('Failed to add canteen. Please try again.');
    }
  };

  const handleEditCanteen = async (e) => {
    e.preventDefault();
    try {
      // Prepare data with proper null handling
      const canteenData = {
        ...formData,
        assignedShopOwner: formData.assignedShopOwner || null, // Convert empty string to null
      };
      
      await canteenAPI.updateCanteen(selectedCanteen._id, canteenData);
      setShowEditModal(false);
      setSelectedCanteen(null);
      resetForm();
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating canteen:', error);
      alert('Failed to update canteen. Please try again.');
    }
  };

  const handleDeleteCanteen = async (canteenId) => {
    if (window.confirm('Are you sure you want to delete this canteen?')) {
      try {
        await canteenAPI.deleteCanteen(canteenId);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting canteen:', error);
        alert('Failed to delete canteen. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '', // For backward compatibility with backend
      address: {
        street: '',
        city: ''
      },
      description: '',
      image: '',
      assignedShopOwner: '',
      status: 'active',
      operatingHours: {
        open: '08:00',
        close: '20:00'
      },
      contact: {
        phone: '',
        email: ''
      }
    });
  };

  // Article CRUD handlers
  const createSimpleArticle = async () => {
    try {
      // Basic validation
      if (!articleFormData.title || articleFormData.title.length < 3) {
        alert('Please enter a title (at least 3 characters)');
        return;
      }
      
      if (!articleFormData.content || articleFormData.content.length < 50) {
        alert('Please enter content (at least 50 characters)');
        return;
      }
      
      // Prepare article data
      const articleData = {
        title: articleFormData.title,
        content: articleFormData.content,
        excerpt: articleFormData.excerpt || '',
        category: articleFormData.category || 'News',
        tags: articleFormData.tags ? articleFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        status: articleFormData.status || 'published'
      };
      
      // Only add image if it's provided and valid
      if (articleFormData.image && articleFormData.image.trim() !== '') {
        // Validate image URL format
        if (articleFormData.image.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
          articleData.image = articleFormData.image;
        }
      }
      
      // Create article
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(articleData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Article created successfully!');
        
        // Close modal
        setShowArticleModal(false);
        resetArticleForm();
        
        // Switch to articles tab
        setActiveTab('articles');
        
        // Refresh data to show the new article
        setTimeout(() => {
          fetchDashboardData();
        }, 500);
      } else {
        alert('Failed to create article: ' + result.message);
      }
      
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Error creating article: ' + error.message);
    }
  };

  const handleAddArticle = async (e) => {
    e.preventDefault();
    console.log('🚀 handleAddArticle called!');
    console.log('📋 Form data:', articleFormData);
    
    try {
      // Validate title length
      if (articleFormData.title.length > 200) {
        alert('Article title cannot exceed 200 characters. Please shorten your title.');
        return;
      }

      // Validate content length
      if (articleFormData.content.length < 50) {
        alert('Article content must be at least 50 characters long. Please add more content.');
        return;
      }

      // Validate image URL if provided
      if (articleFormData.image && !articleFormData.image.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
        alert('Image URL must end with .jpg, .jpeg, .png, .gif, or .webp. Please provide a valid image URL or leave it blank.');
        return;
      }

      console.log('✅ Validation passed, creating article...');

      const articleData = {
        ...articleFormData,
        tags: articleFormData.tags 
          ? articleFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : [],
        image: articleFormData.image || null
      };
      
      console.log('📦 Sending article data:', articleData);
      
      // Create the article
      const response = await articleAPI.createArticle(articleData);
      
      console.log('📊 API response:', response);
      
      if (response.success) {
        console.log('✅ Article created successfully!');
        
        // Close modal and reset form
        setShowArticleModal(false);
        resetArticleForm();
        
        // Switch to articles tab
        setActiveTab('articles');
        
        // Refresh dashboard data to show the new article
        await fetchDashboardData();
        
        // Show success message
        alert('Article created successfully!');
      } else {
        console.log('❌ Article creation failed:', response);
        alert('Failed to create article: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error adding article:', error);
      alert('Failed to add article. Please try again.');
    }
  };

  const handleEditArticle = async (e) => {
    e.preventDefault();
    try {
      // Validate title length
      if (articleFormData.title.length > 200) {
        alert('Article title cannot exceed 200 characters. Please shorten your title.');
        return;
      }

      // Validate content length
      if (articleFormData.content.length < 50) {
        alert('Article content must be at least 50 characters long. Please add more content.');
        return;
      }

      // Validate image URL if provided
      if (articleFormData.image && !articleFormData.image.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
        alert('Image URL must end with .jpg, .jpeg, .png, .gif, or .webp. Please provide a valid image URL or leave it blank.');
        return;
      }

      const articleData = {
        ...articleFormData,
        tags: articleFormData.tags 
          ? articleFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : [],
        image: articleFormData.image || null // Send null instead of default if empty
      };
      
      await articleAPI.updateArticle(selectedArticle._id, articleData);
      setShowEditArticleModal(false);
      setSelectedArticle(null);
      resetArticleForm();
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article. Please try again.');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleAPI.deleteArticle(articleId);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article. Please try again.');
      }
    }
  };

  const resetArticleForm = () => {
    setArticleFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'Food Review',
      tags: '',
      image: '',
      status: 'pending'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your SLIIT Eats system</p>
            </div>
            <Button 
              onClick={() => {
                if (activeTab === 'canteens') {
                  resetForm();
                  setShowAddModal(true);
                } else {
                  resetArticleForm();
                  setShowArticleModal(true);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={16} className="mr-2" />
              Add {activeTab === 'canteens' ? 'Canteen' : 'Article'}
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-6">
            <button
              onClick={() => setActiveTab('canteens')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'canteens'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ShoppingCart size={16} className="inline mr-2" />
              Canteens
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileText size={16} className="inline mr-2" />
              Articles & News
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Canteens</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCanteens}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={24} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Canteens</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeCanteens}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">Good</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield size={24} className="text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'canteens' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Canteens Management</span>
                <span className="text-sm font-normal text-gray-600">
                  Showing {canteens.length} canteens
                </span>
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Canteen</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Shop Owner</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Hours</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {canteens.map((canteen) => (
                    <tr key={canteen._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={canteen.image}
                            alt={canteen.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(canteen.name) + '&background=random';
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{canteen.name}</p>
                            <p className="text-sm text-gray-500">{canteen.description?.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-gray-700">{canteen.address?.street || 'N/A'}, {canteen.address?.city || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-gray-700">
                            {canteen.assignedShopOwner ? canteen.assignedShopOwner.name : 'Not assigned'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm">{canteen.contact?.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail size={14} className="text-gray-400" />
                            <span className="text-sm">{canteen.contact?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-sm">{canteen.operatingHours?.open} - {canteen.operatingHours?.close}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(canteen.status)}>
                          <span className="capitalize">{canteen.status}</span>
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedCanteen(canteen);
                              setFormData({
                                name: canteen.name,
                                location: `${canteen.address?.street || ''}, ${canteen.address?.city || ''}`, // For backward compatibility
                                address: canteen.address || { street: '', city: '' },
                                description: canteen.description,
                                image: canteen.image,
                                assignedShopOwner: canteen.assignedShopOwner?._id || '',
                                status: canteen.status,
                                operatingHours: canteen.operatingHours,
                                contact: canteen.contact
                              });
                              setShowEditModal(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCanteen(canteen._id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Articles & News Management</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-normal text-gray-600">
                    Showing {articles.length} articles
                  </span>
                  <Button
                    onClick={() => window.location.href = '/admin/create-article'}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Article
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Article</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Author</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          No articles found. Create your first article!
                        </td>
                      </tr>
                    ) : (
                      articles.map((article) => (
                        <tr key={article._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{article.title}</p>
                                <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt || article.content?.substring(0, 100)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700">
                              {article.author?.name || article.createdBy?.name || 'Super Admin'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              {article.category}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }>
                              {article.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-700">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedArticle(article);
                                  setArticleFormData({
                                    title: article.title,
                                    content: article.content,
                                    excerpt: article.excerpt,
                                    category: article.category,
                                    tags: article.tags ? article.tags.join(', ') : '',
                                    image: article.image || '',
                                    status: article.status
                                  });
                                  setShowEditArticleModal(true);
                                }}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteArticle(article._id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {showAddModal ? 'Add New Canteen' : 'Edit Canteen'}
            </h2>
            
            <form onSubmit={showAddModal ? handleAddCanteen : handleEditCanteen} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canteen Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => {
                    const newStreet = e.target.value;
                    const newCity = formData.address.city;
                    setFormData({
                      ...formData, 
                      address: {...formData.address, street: newStreet},
                      location: `${newStreet}, ${newCity}` // Update location for backward compatibility
                    });
                  }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => {
                    const newStreet = formData.address.street;
                    const newCity = e.target.value;
                    setFormData({
                      ...formData, 
                      address: {...formData.address, city: newCity},
                      location: `${newStreet}, ${newCity}` // Update location for backward compatibility
                    });
                  }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Owner
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.assignedShopOwner}
                    onChange={(e) => setFormData({...formData, assignedShopOwner: e.target.value})}
                  >
                    <option value="">Select Shop Owner</option>
                    {shopOwners.map(owner => (
                      <option key={owner._id} value={owner._id}>
                        {owner.name} - {owner.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedCanteen(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  {showAddModal ? 'Add Canteen' : 'Update Canteen'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Add/Edit Modal */}
      {(showArticleModal || showEditArticleModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {showArticleModal ? 'Add New Article' : 'Edit Article'}
            </h2>
            
            <form onSubmit={showArticleModal ? handleAddArticle : handleEditArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={articleFormData.title}
                  onChange={(e) => setArticleFormData({...articleFormData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={200}
                  placeholder="Enter article title (max 200 characters)"
                />
                <div className="mt-1 text-sm text-gray-500">
                  {articleFormData.title.length}/200 characters
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <input
                  type="text"
                  value={articleFormData.excerpt}
                  onChange={(e) => setArticleFormData({...articleFormData, excerpt: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the article (max 300 characters)"
                  maxLength={300}
                />
                <div className="mt-1 text-sm text-gray-500">
                  {articleFormData.excerpt.length}/300 characters
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={articleFormData.content}
                  onChange={(e) => setArticleFormData({...articleFormData, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  required
                  placeholder="Write your article content here (minimum 50 characters)..."
                />
                <div className="mt-1 text-sm">
                  <span className={articleFormData.content.length >= 50 ? "text-green-600" : "text-gray-500"}>
                    {articleFormData.content.length} characters 
                    {articleFormData.content.length >= 50 ? " ✓" : " (minimum 50 required)"}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={articleFormData.category}
                    onChange={(e) => setArticleFormData({...articleFormData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={articleFormData.status}
                    onChange={(e) => setArticleFormData({...articleFormData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={articleFormData.tags}
                  onChange={(e) => setArticleFormData({...articleFormData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="food, campus, news"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={articleFormData.image}
                  onChange={(e) => setArticleFormData({...articleFormData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional: https://example.com/image.jpg (must end with .jpg, .png, etc.)"
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowArticleModal(false);
                    setShowEditArticleModal(false);
                    setSelectedArticle(null);
                    resetArticleForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => createSimpleArticle()}
                >
                  {showArticleModal ? 'Publish Article' : 'Update Article'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
