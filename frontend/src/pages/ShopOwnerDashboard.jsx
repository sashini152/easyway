import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    PlusIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canteenAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ShopOwnerDashboard = () => {
    const { user } = useAuth();
    const [canteen, setCanteen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
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

    useEffect(() => {
        fetchCanteen();
    }, []);

    const fetchCanteen = async () => {
        try {
            setLoading(true);
            const response = await canteenAPI.getShopOwnerCanteen();
            if (response.success) {
                setCanteen(response.data);
                setFormData({
                    name: response.data.name,
                    location: response.data.location,
                    description: response.data.description,
                    image: response.data.image,
                    status: response.data.status,
                    operatingHours: response.data.operatingHours,
                    contact: response.data.contact,
                    address: response.data.address,
                    facilities: response.data.facilities || []
                });
            }
        } catch (error) {
            console.error('Error fetching canteen:', error);
            // If no canteen assigned, show message
            if (error.message === 'No canteen assigned to you') {
                setCanteen(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await canteenAPI.updateCanteen(canteen._id, formData);
            setShowEditModal(false);
            fetchCanteen();
        } catch (error) {
            console.error('Error updating canteen:', error);
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
                            <Badge className={getStatusColor(canteen.status)}>
                                <span className="capitalize">{canteen.status}</span>
                            </Badge>
                            <Badge className={isOpen() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {isOpen() ? 'Open Now' : 'Closed'}
                            </Badge>
                            <Button 
                                onClick={() => setShowEditModal(true)}
                                className="bg-brand-500 hover:bg-brand-600"
                            >
                                <EditIcon size={16} className="mr-2" />
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
                                    <Button variant="outline" size="sm">
                                        <PlusIcon size={14} className="mr-2" />
                                        Add Item
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {canteen.menu?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                                    <span className="text-lg">🍽️</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-surface-900">{item.name}</p>
                                                    <p className="text-sm text-surface-500">{item.category}</p>
                                                    {item.description && (
                                                        <p className="text-sm text-surface-600 mt-1">{item.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-surface-900">Rs. {item.price}</p>
                                                <Badge className={item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
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
                                        value={formData.operatingHours.open}
                                        onChange={(e) => setFormData({...formData, operatingHours: {...formData.operatingHours, open: e.target.value}})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Close Time *
                                    </label>
                                    <Input
                                        type="time"
                                        value={formData.operatingHours.close}
                                        onChange={(e) => setFormData({...formData, operatingHours: {...formData.operatingHours, close: e.target.value}})}
                                        required
                                    />
                                </div>
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
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ShopOwnerDashboard;
