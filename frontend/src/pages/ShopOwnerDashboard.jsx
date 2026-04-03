import React, { useState, useEffect } from 'react';
import { 
    MapPinIcon, 
    PhoneIcon, 
    MailIcon, 
    ClockIcon,
    EditIcon,
    StarIcon,
    UsersIcon,
    TrendingUpIcon,
    CalendarIcon,
    PlusIcon,
    Trash2Icon,
    PackageIcon,
    FileText,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canteenAPI } from '../services/api';
import ReservationManagement from '../components/ReservationManagement';
import { useAuth } from '../contexts/AuthContext';

const ShopOwnerDashboard = () => {
    const { user } = useAuth();
    const [canteen, setCanteen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [articleForm, setArticleForm] = useState({
        title: '',
        content: '',
        category: 'News',
        status: 'published',
        excerpt: '',
        image: ''
    });
    const [menuItemForm, setMenuItemForm] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Main Course',
        image: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        image: '',
        status: 'active',
        operatingHours: {
            open: '08:00',
            close: '20:00'
        },
        contact: {
            phone: '',
            email: ''
        },
        address: {
            street: '',
            city: '',
            postalCode: ''
        },
        facilities: []
    });

    // Menu Item Handlers
    const handleMenuItemSubmit = async (e) => {
        e.preventDefault();
        
        // Check if canteen is loaded
        if (!canteen || !canteen._id) {
            console.error('❌ Canteen not loaded, cannot add menu items');
            alert('Please wait for shop data to load before adding menu items');
            return;
        }
        
        try {
            if (editingMenuItem) {
                // Update existing item
                const response = await canteenAPI.updateMenuItem(editingMenuItem._id, menuItemForm);
                if (response.success) {
                    setMenuItems(prev => prev.map(item => 
                        item._id === editingMenuItem._id ? response.data : item
                    ));
                    setShowMenuModal(false);
                    setEditingMenuItem(null);
                    alert('Menu item updated successfully!');
                }
            } else {
                // Add new item
                console.log('🔍 Adding new menu item:', menuItemForm);
                console.log('🏪 Canteen ID:', canteen._id);
                const response = await canteenAPI.createMenuItem(canteen._id, menuItemForm);
                console.log('📊 Create response:', response);
                if (response.success) {
                    setMenuItems(prev => [...prev, response.data]);
                    setShowMenuModal(false);
                    setMenuItemForm({
                        name: '',
                        description: '',
                        price: '',
                        category: 'Main Course',
                        image: ''
                    });
                    alert('Menu item added successfully!');
                }
            }
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert('Failed to save menu item. Please try again.');
        }
    };

    const handleDeleteMenuItem = async (itemId) => {
        // Check if canteen is loaded
        if (!canteen || !canteen._id) {
            console.error('❌ Canteen not loaded, cannot delete menu items');
            alert('Please wait for shop data to load before deleting menu items');
            return;
        }
        
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            try {
                const response = await canteenAPI.deleteMenuItem(itemId);
                if (response.success) {
                    setMenuItems(prev => prev.filter(item => item._id !== itemId));
                    alert('Menu item deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting menu item:', error);
                alert('Failed to delete menu item. Please try again.');
            }
        }
    };

    useEffect(() => {
        const fetchShopDetails = async () => {
            if (!user) return;

            try {
                console.log('🔍 Fetching shop details for user:', user.name, user.email, 'Assigned Canteen:', user.assignedCanteen);
                const response = await canteenAPI.getShopOwnerCanteen();
                console.log('🔍 Shop owner canteen response:', response);

                if (response.success && response.data) {
                    setCanteen(response.data);
                    setFormData({
                        name: response.data.name,
                        description: response.data.description,
                        location: response.data.location,
                        contact: response.data.contact,
                        address: response.data.address || {
                            street: '',
                            city: '',
                            postalCode: ''
                        },
                        facilities: response.data.facilities || []
                    });
                    
                    // Fetch menu items for this canteen
                    if (response.data._id) {
                        console.log('🍽 Fetching menu items for canteen:', response.data._id);
                        const menuResponse = await canteenAPI.getMenuItems(response.data._id);
                        console.log('� Menu response:', menuResponse);
                        if (menuResponse.success) {
                            setMenuItems(menuResponse.data);
                        }
                    }
                } else {
                    console.error('No canteen found for shop owner');
                    setCanteen(null);
                }
            } catch (error) {
                console.error('💥 Error fetching shop details:', error);
                setCanteen(null);
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔍 Submitting canteen update with data:', formData);
        try {
            const response = await canteenAPI.updateCanteen(canteen._id, formData);
            console.log('🔍 Update canteen response:', response);
            
            if (response.success) {
                alert('Canteen updated successfully!');
                setShowEditModal(false);
                
                // Refresh canteen data
                const fetchShopDetails = async () => {
                    if (!user) return;

                    try {
                        console.log('🔍 Fetching shop details for user:', user.name, user.email, 'Assigned Canteen:', user.assignedCanteen);
                        const shopResponse = await canteenAPI.getShopOwnerCanteen();
                        console.log('🔍 Shop owner canteen response:', shopResponse);

                        if (shopResponse.success && shopResponse.data) {
                            setCanteen(shopResponse.data);
                            setFormData({
                                name: shopResponse.data.name,
                                description: shopResponse.data.description,
                                location: shopResponse.data.location,
                                contact: shopResponse.data.contact,
                                address: shopResponse.data.address || {
                                    street: '',
                                    city: '',
                                    postalCode: ''
                                },
                                facilities: shopResponse.data.facilities || [],
                                operatingHours: shopResponse.data.operatingHours || {
                                    open: '08:00',
                                    close: '20:00'
                                },
                                image: shopResponse.data.image || '',
                                status: shopResponse.data.status || 'active'
                            });
                            
                            // Fetch menu items for this canteen
                            if (shopResponse.data._id) {
                                console.log('🍽 Fetching menu items for canteen:', shopResponse.data._id);
                                const menuResponse = await canteenAPI.getMenuItems(shopResponse.data._id);
                                console.log('📝 Menu response:', menuResponse);
                                if (menuResponse.success) {
                                    setMenuItems(menuResponse.data || []);
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching shop details:', error);
                    }
                };
                
                fetchShopDetails();
            } else {
                alert('Failed to update canteen: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating canteen:', error);
            alert('Failed to update canteen. Please try again.');
        }
    };

    // Menu item functions

    // Fetch articles for this canteen
    const fetchCanteenArticles = async () => {
        if (!canteen) return;
        
        setLoadingArticles(true);
        try {
            const response = await fetch(`http://localhost:5000/api/articles?canteen=${canteen._id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await response.json();
            
            console.log('🔍 fetchCanteenArticles: API response', result);
            
            if (result.success) {
                // Handle the nested data structure from backend
                const articlesData = Array.isArray(result.data?.articles) ? result.data.articles : [];
                console.log('🔍 fetchCanteenArticles: Articles loaded', articlesData.length);
                setArticles(articlesData);
            } else {
                console.error('Failed to fetch articles:', result.message);
                setArticles([]);
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticles([]);
        } finally {
            setLoadingArticles(false);
        }
    };

    // Fetch articles when canteen is loaded
    useEffect(() => {
        if (canteen) {
            fetchCanteenArticles();
        }
    }, [canteen]);

    // Article management functions
    const handleEditArticle = (article) => {
        setEditingArticle(article);
        setArticleForm({
            title: article.title,
            content: article.content,
            category: article.category,
            status: article.status,
            excerpt: article.excerpt || '',
            image: article.image || ''
        });
        setShowArticleModal(true);
    };

    const handleDeleteArticle = async (articleId) => {
        if (!confirm('Are you sure you want to delete this article?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/articles/${articleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Article deleted successfully!');
                fetchCanteenArticles(); // Refresh articles list
            } else {
                alert('Failed to delete article: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article. Please try again.');
        }
    };

    const handleUpdateArticle = async (e) => {
        e.preventDefault();
        
        if (!editingArticle) return;

        try {
            const token = localStorage.getItem('token');
            const articleData = {
                ...articleForm,
                canteen: canteen._id,
                canteenName: canteen.name
            };

            const response = await fetch(`http://localhost:5000/api/articles/${editingArticle._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(articleData)
            });

            const result = await response.json();
            
            if (result.success) {
                alert('Article updated successfully!');
                setShowArticleModal(false);
                setEditingArticle(null);
                fetchCanteenArticles(); // Refresh articles list
            } else {
                alert('Failed to update article: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating article:', error);
            alert('Failed to update article. Please try again.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const isOpen = () => {
        if (!canteen) return false;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const openTime = canteen.operatingHours.open.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m), 0);
        const closeTime = canteen.operatingHours.close.split(':').reduce((h, m) => parseInt(h) * 60 + parseInt(m), 0);
        
        return currentTime >= openTime && currentTime <= closeTime;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-surface-600">Loading your canteen...</p>
                </div>
            </div>
        );
    }

    if (!canteen) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-white rounded-xl p-8 shadow-sm max-w-md">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPinIcon size={24} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-surface-900 mb-2">No Canteen Assigned</h2>
                        <p className="text-surface-600 mb-4">
                            You haven't been assigned to any canteen yet. Please contact the Super Admin.
                        </p>
                        <div className="bg-surface-50 rounded-lg p-4">
                            <p className="text-sm text-surface-600">
                                <strong>Contact:</strong> admin@easyway.com
                            </p>
                        </div>
                    </div>
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
                            <h1 className="text-2xl font-bold text-surface-900">My Canteen</h1>
                            <p className="text-surface-600 mt-1">Manage your assigned canteen</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline"
                                onClick={() => window.location.href = '/shop-owner/create-article'}
                                className="flex items-center gap-2"
                            >
                                <PackageIcon className="h-4 w-4" />
                                Create Article
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => setShowEditModal(true)}
                                className="flex items-center gap-2"
                            >
                                <EditIcon className="h-4 w-4" />
                                Edit Canteen
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canteen Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Canteen Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative h-64 bg-surface-100 rounded-t-xl overflow-hidden">
                                    <img
                                        src={canteen.image}
                                        alt={canteen.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(canteen.name) + '&background=random&size=400';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h2 className="text-2xl font-bold">{canteen.name}</h2>
                                        <p className="text-white/90">{canteen.location}</p>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <p className="text-surface-700 mb-6">{canteen.description}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <PhoneIcon size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-surface-500">Phone</p>
                                                <p className="font-medium text-surface-900">{canteen.contact.phone}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <MailIcon size={18} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-surface-500">Email</p>
                                                <p className="font-medium text-surface-900">{canteen.contact.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <ClockIcon size={18} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-surface-500">Hours</p>
                                                <p className="font-medium text-surface-900">
                                                    {canteen.operatingHours.open} - {canteen.operatingHours.close}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <MapPinIcon size={18} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-surface-500">Address</p>
                                                <p className="font-medium text-surface-900">{canteen.address.street}, {canteen.address.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-surface-900 mb-3">Facilities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {canteen.facilities.map((facility, index) => (
                                                <Badge key={index} className="bg-surface-100 text-surface-700">
                                                    {facility}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Menu Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Menu Items</span>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setShowMenuModal(true)}
                                    >
                                        <PlusIcon size={14} className="mr-2" />
                                        Add Item
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {menuItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Menu Items</h3>
                                            <p className="text-gray-500 mb-4">Start adding items to your menu</p>
                                            <Button 
                                                onClick={() => setShowMenuModal(true)}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <PlusIcon className="h-4 w-4 mr-2" />
                                                Add First Item
                                            </Button>
                                        </div>
                                    ) : (
                                        menuItems.map((item) => (
                                            <div key={item._id} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg hover:bg-surface-100">
                                                <div className="flex items-center gap-4">
                                                    {item.image && (
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div>
                                                        <h4 className="font-semibold text-surface-900">{item.name}</h4>
                                                        <p className="text-sm text-surface-600">{item.category}</p>
                                                        <p className="text-lg font-bold text-blue-600">Rs. {item.price}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingMenuItem(item);
                                                            setMenuItemForm({
                                                                name: item.name,
                                                                description: item.description,
                                                                price: item.price,
                                                                category: item.category,
                                                                image: item.image
                                                            });
                                                            setShowMenuModal(true);
                                                        }}
                                                    >
                                                        <EditIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDeleteMenuItem(item._id)}
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats & Reviews */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StarIcon size={16} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm text-surface-600">Rating</span>
                                        </div>
                                        <span className="font-semibold text-surface-900">
                                            {canteen.averageRating?.toFixed(1) || '0.0'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <UsersIcon size={16} className="text-blue-500" />
                                            <span className="text-sm text-surface-600">Reviews</span>
                                        </div>
                                        <span className="font-semibold text-surface-900">
                                            {canteen.totalReviews || 0}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <TrendingUpIcon size={16} className="text-green-500" />
                                            <span className="text-sm text-surface-600">Menu Items</span>
                                        </div>
                                        <span className="font-semibold text-surface-900">
                                            {canteen.menu?.length || 0}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon size={16} className="text-purple-500" />
                                            <span className="text-sm text-surface-600">Created</span>
                                        </div>
                                        <span className="font-semibold text-surface-900">
                                            {new Date(canteen.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Reviews</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {canteen.reviews?.slice(0, 3).map((review, index) => (
                                        <div key={index} className="border-b border-surface-100 pb-4 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-surface-900">{review.user.name}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            size={12}
                                                            className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-surface-600">{review.comment}</p>
                                            <p className="text-xs text-surface-400 mt-1">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    
                        <h2 className="text-xl font-bold text-surface-900 mb-6">Edit Canteen</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Canteen Name *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Location *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        required
                                        rows={3}
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Image URL *
                                    </label>
                                    <Input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Phone *
                                    </label>
                                    <Input
                                        type="tel"
                                        value={formData.contact.phone}
                                        onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        value={formData.contact.email}
                                        onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Street *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.address.street}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        City *
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.address.city}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Open Time *
                                    </label>
                                    <Input
                                        type="time"
                                        value={formData.operatingHours?.open || '08:00'}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            operatingHours: {
                                                ...formData.operatingHours, 
                                                open: e.target.value
                                            }
                                        })}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Close Time *
                                    </label>
                                    <Input
                                        type="time"
                                        value={formData.operatingHours?.close || '20:00'}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            operatingHours: {
                                                ...formData.operatingHours, 
                                                close: e.target.value
                                            }
                                        })}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Canteen Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Active: Canteen is open for business<br/>
                                    Inactive: Canteen is temporarily closed<br/>
                                    Maintenance: Canteen is under maintenance
                                </p>
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Update Canteen
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Menu Item Modal */}
            {showMenuModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {editingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setShowMenuModal(false);
                                    setEditingMenuItem(null);
                                    setMenuItemForm({
                                        name: '',
                                        description: '',
                                        price: '',
                                        category: 'Main Course',
                                        image: ''
                                    });
                                }}
                            >
                                ×
                            </Button>
                        </div>
                        <form onSubmit={handleMenuItemSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Name *
                                </label>
                                <Input
                                    value={menuItemForm.name}
                                    onChange={(e) => setMenuItemForm({...menuItemForm, name: e.target.value})}
                                    placeholder="Enter item name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={menuItemForm.description}
                                    onChange={(e) => setMenuItemForm({...menuItemForm, description: e.target.value})}
                                    placeholder="Describe your menu item"
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (Rs.) *
                                    </label>
                                    <Input
                                        type="number"
                                        value={menuItemForm.price}
                                        onChange={(e) => setMenuItemForm({...menuItemForm, price: e.target.value})}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={menuItemForm.category}
                                        onChange={(e) => setMenuItemForm({...menuItemForm, category: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="Main Course">Main Course</option>
                                        <option value="Appetizer">Appetizer</option>
                                        <option value="Dessert">Dessert</option>
                                        <option value="Beverage">Beverage</option>
                                        <option value="Snack">Snack</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URL
                                </label>
                                <Input
                                    type="url"
                                    value={menuItemForm.image}
                                    onChange={(e) => setMenuItemForm({...menuItemForm, image: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowMenuModal(false);
                                        setEditingMenuItem(null);
                                        setMenuItemForm({
                                            name: '',
                                            description: '',
                                            price: '',
                                            category: 'Main Course',
                                            image: ''
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingMenuItem ? 'Update Item' : 'Add Item'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Articles Section */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Articles & News</span>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.href = '/shop-owner/create-article'}
                            >
                                <PackageIcon className="h-4 w-4 mr-2" />
                                Create Article
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingArticles ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading articles...</p>
                            </div>
                        ) : articles.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Articles Yet</h3>
                                <p className="text-gray-500 mb-4">Share news and updates about your canteen</p>
                                <Button 
                                    onClick={() => window.location.href = '/shop-owner/create-article'}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <PackageIcon className="h-4 w-4 mr-2" />
                                    Create First Article
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Array.isArray(articles) && articles.map((article) => (
                                    <div key={article._id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-2">{article.title}</h4>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.content?.substring(0, 100) || ''}...</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {new Date(article.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                    {article.category}
                                                </span>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                                    {article.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`/blog/${article._id}`} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </a>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleEditArticle(article)}
                                            >
                                                <EditIcon className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleDeleteArticle(article._id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Reservations Section */}
            <div className="mt-8">
                <ReservationManagement canteenId={canteen?._id} />
            </div>
            
            {/* Debug Info */}
            {import.meta.env.DEV && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
                    <p>Debug Info:</p>
                    <p>Canteen ID: {canteen?._id}</p>
                    <p>Canteen Name: {canteen?.name}</p>
                    <p>User: {user?.name} ({user?.role})</p>
                </div>
            )}

            {/* Edit Article Modal */}
            {showArticleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editingArticle ? 'Edit Article' : 'Create Article'}
                        </h2>
                        
                        <form onSubmit={handleUpdateArticle} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Article Title *
                                </label>
                                <Input
                                    type="text"
                                    value={articleForm.title}
                                    onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    placeholder="Enter article title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    value={articleForm.content}
                                    onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    rows={6}
                                    placeholder="Enter article content (minimum 50 characters)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Excerpt
                                </label>
                                <textarea
                                    value={articleForm.excerpt}
                                    onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Brief summary of the article"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={articleForm.category}
                                    onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
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
                                    Article Image URL or Base64
                                </label>
                                <Input
                                    type="text"
                                    value={articleForm.image}
                                    onChange={(e) => setArticleForm({...articleForm, image: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com/image.jpg or data:image/jpeg;base64,..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter an image URL or paste a base64 image (jpg, jpeg, png, gif, webp)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={articleForm.status}
                                    onChange={(e) => setArticleForm({...articleForm, status: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowArticleModal(false);
                                        setEditingArticle(null);
                                        setArticleForm({
                                            title: '',
                                            content: '',
                                            category: 'News',
                                            status: 'published',
                                            excerpt: '',
                                            image: ''
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingArticle ? 'Update Article' : 'Create Article'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopOwnerDashboard;
