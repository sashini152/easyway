import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    PlusIcon, 
    EditIcon, 
    TrashIcon, 
    SearchIcon,
    FilterIcon,
    MapPinIcon,
    PhoneIcon,
    MailIcon,
    ClockIcon,
    UserIcon,
    StarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canteenAPI, userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminCanteenManagement = () => {
    const { user } = useAuth();
    const [canteens, setCanteens] = useState([]);
    const [shopOwners, setShopOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCanteen, setSelectedCanteen] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
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
        },
        address: {
            street: '',
            city: '',
            postalCode: ''
        },
        facilities: []
    });

    useEffect(() => {
        fetchCanteens();
        fetchShopOwners();
    }, []);

    useEffect(() => {
        let filtered = canteens;

        if (searchTerm) {
            filtered = filtered.filter(canteen =>
                canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                canteen.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                canteen.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(canteen => canteen.status === statusFilter);
        }

        setCanteens(filtered);
    }, [searchTerm, statusFilter]);

    const fetchCanteens = async () => {
        try {
            setLoading(true);
            const response = await canteenAPI.getAdminCanteens();
            if (response.success) {
                setCanteens(response.data.canteens);
            }
        } catch (error) {
            console.error('Error fetching canteens:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchShopOwners = async () => {
        try {
            const response = await userAPI.getAllUsers({ role: 'shop_owner' });
            if (response.success) {
                setShopOwners(response.data.users);
            }
        } catch (error) {
            console.error('Error fetching shop owners:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCanteen) {
                await canteenAPI.updateCanteen(selectedCanteen._id, formData);
            } else {
                await canteenAPI.createCanteen(formData);
            }
            
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCanteen(null);
            resetForm();
            fetchCanteens();
        } catch (error) {
            console.error('Error saving canteen:', error);
        }
    };

    const handleEdit = (canteen) => {
        setSelectedCanteen(canteen);
        setFormData({
            name: canteen.name,
            location: canteen.location,
            description: canteen.description,
            image: canteen.image,
            assignedShopOwner: canteen.assignedShopOwner?._id || '',
            status: canteen.status,
            operatingHours: canteen.operatingHours,
            contact: canteen.contact,
            address: canteen.address,
            facilities: canteen.facilities || []
        });
        setShowEditModal(true);
    };

    const handleDelete = async (canteenId) => {
        if (window.confirm('Are you sure you want to delete this canteen?')) {
            try {
                await canteenAPI.deleteCanteen(canteenId);
                fetchCanteens();
            } catch (error) {
                console.error('Error deleting canteen:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
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
            },
            address: {
                street: '',
                city: '',
                postalCode: ''
            },
            facilities: []
        });
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

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-surface-600">Loading canteens...</p>
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
                            <h1 className="text-2xl font-bold text-surface-900">Canteen Management</h1>
                            <p className="text-surface-600 mt-1">Manage all campus canteens</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search canteens..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <FilterIcon size={20} className="text-surface-400" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
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
                                Add Canteen
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Canteens', value: canteens.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Active', value: canteens.filter(c => c.status === 'active').length, color: 'bg-green-50 text-green-700' },
                        { label: 'Inactive', value: canteens.filter(c => c.status === 'inactive').length, color: 'bg-red-50 text-red-700' },
                        { label: 'Shop Owners', value: shopOwners.length, color: 'bg-purple-50 text-purple-700' },
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
                                    <MapPinIcon size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Canteens Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Canteen Details</span>
                            <span className="text-sm font-normal text-surface-600">
                                Showing {canteens.length} canteens
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-200">
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Canteen</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Location</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Shop Owner</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Contact</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Hours</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {canteens.map((canteen, index) => (
                                        <motion.tr
                                            key={canteen._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                        >
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
                                                        <p className="font-medium text-surface-900">{canteen.name}</p>
                                                        <p className="text-sm text-surface-500">{canteen.description.substring(0, 50)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{canteen.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">
                                                        {canteen.assignedShopOwner ? canteen.assignedShopOwner.name : 'Not assigned'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-surface-700">
                                                        <PhoneIcon size={14} className="text-surface-400" />
                                                        <span className="text-sm">{canteen.contact.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-surface-700">
                                                        <MailIcon size={14} className="text-surface-400" />
                                                        <span className="text-sm">{canteen.contact.email || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-surface-700">
                                                    <ClockIcon size={16} className="text-surface-400" />
                                                    <span className="text-sm">{canteen.operatingHours.open} - {canteen.operatingHours.close}</span>
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
                                                        onClick={() => handleEdit(canteen)}
                                                    >
                                                        <EditIcon size={14} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDelete(canteen._id)}
                                                    >
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

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold text-surface-900 mb-6">
                            {showAddModal ? 'Add New Canteen' : 'Edit Canteen'}
                        </h2>
                        
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
                                
                                <div>
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
                                        Shop Owner
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                                    <label className="block text-sm font-medium text-surface-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
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
                                        Postal Code
                                    </label>
                                    <Input
                                        type="text"
                                        value={formData.address.postalCode}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, postalCode: e.target.value}})}
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
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {showAddModal ? 'Add Canteen' : 'Update Canteen'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminCanteenManagement;
