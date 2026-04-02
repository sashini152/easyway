import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    CalendarIcon, 
    ClockIcon, 
    TagIcon, 
    TrendingUpIcon,
    SearchIcon,
    FilterIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    PercentIcon,
    GiftIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch offers from API
        const fetchOffers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/offers');
                const data = await response.json();
                
                if (data.success) {
                    setOffers(data.data);
                    setFilteredOffers(data.data);
                } else {
                    console.error('Failed to fetch offers:', data.message);
                }
            } catch (error) {
                console.error('Error fetching offers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        let filtered = offers;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(offer =>
                offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(offer => offer.status === statusFilter);
        }

        setFilteredOffers(filtered);
    }, [searchTerm, statusFilter, offers]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'expired':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'upcoming':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'student':
                return 'bg-blue-100 text-blue-700';
            case 'combo':
                return 'bg-orange-100 text-orange-700';
            case 'time':
                return 'bg-green-100 text-green-700';
            case 'special':
                return 'bg-pink-100 text-pink-700';
            case 'loyalty':
                return 'bg-yellow-100 text-yellow-700';
            case 'seasonal':
                return 'bg-purple-100 text-purple-700';
            case 'clearance':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-surface-600">Loading offers...</p>
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
                            <h1 className="text-2xl font-bold text-surface-900">Offers Management</h1>
                            <p className="text-surface-600 mt-1">Manage and view all special offers and promotions</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search offers..."
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
                                    <option value="expired">Expired</option>
                                    <option value="upcoming">Upcoming</option>
                                </select>
                            </div>
                            <Button className="bg-brand-500 hover:bg-brand-600">
                                <PlusIcon size={16} className="mr-2" />
                                New Offer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Offers', value: offers.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Active', value: offers.filter(o => o.status === 'active').length, color: 'bg-green-50 text-green-700' },
                        { label: 'Expired', value: offers.filter(o => o.status === 'expired').length, color: 'bg-red-50 text-red-700' },
                        { label: 'Upcoming', value: offers.filter(o => o.status === 'upcoming').length, color: 'bg-yellow-50 text-yellow-700' },
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
                                    <PercentIcon size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Offers Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Offer Details</span>
                            <span className="text-sm font-normal text-surface-600">
                                Showing {filteredOffers.length} of {offers.length} offers
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-200">
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Offer</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Shop</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Discount</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Valid Until</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Min Order</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Usage Limit</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOffers.map((offer, index) => (
                                        <motion.tr
                                            key={offer.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${offer.color} flex items-center justify-center text-white`}>
                                                        <GiftIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-surface-900 max-w-xs truncate">{offer.title}</p>
                                                        <p className="text-sm text-surface-500">ID: #{offer.id}</p>
                                                        <p className="text-sm text-surface-600 max-w-xs truncate">{offer.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={getCategoryColor(offer.category)}>
                                                    {offer.category}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-surface-700">{offer.shopName}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <TagIcon size={16} className="text-surface-400" />
                                                    <span className="font-medium text-surface-900">{offer.discount}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-surface-700">
                                                    <CalendarIcon size={16} className="text-surface-400" />
                                                    <span className="text-sm">{new Date(offer.validUntil).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-medium text-surface-900">{offer.minOrder}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-surface-600">{offer.usageLimit}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={getStatusColor(offer.status)}>
                                                    <span className="capitalize">{offer.status}</span>
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

export default OffersPage;
