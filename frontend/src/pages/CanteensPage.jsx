import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MapPinIcon, 
    ClockIcon, 
    StarIcon, 
    UsersIcon,
    SearchIcon,
    FilterIcon,
    PlusIcon,
    EditIcon,
    TrashIcon,
    EyeIcon,
    UtensilsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CanteensPage = () => {
    const [canteens, setCanteens] = useState([]);
    const [filteredCanteens, setFilteredCanteens] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch canteens from API
        const fetchCanteens = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/canteens');
                const data = await response.json();
                
                if (data.success) {
                    setCanteens(data.data);
                    setFilteredCanteens(data.data);
                } else {
                    console.error('Failed to fetch canteens:', data.message);
                }
            } catch (error) {
                console.error('Error fetching canteens:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCanteens();
    }, []);

    useEffect(() => {
        let filtered = canteens;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(canteen =>
                canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                canteen.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                canteen.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                canteen.manager.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(canteen => canteen.status === statusFilter);
        }

        setFilteredCanteens(filtered);
    }, [searchTerm, statusFilter, canteens]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'open':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-200';
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
                            <h1 className="text-2xl font-bold text-surface-900">Canteens Management</h1>
                            <p className="text-surface-600 mt-1">Manage and view all campus canteens</p>
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
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <Button className="bg-brand-500 hover:bg-brand-600">
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
                        { label: 'Open', value: canteens.filter(c => c.status === 'open').length, color: 'bg-green-50 text-green-700' },
                        { label: 'Closed', value: canteens.filter(c => c.status === 'closed').length, color: 'bg-red-50 text-red-700' },
                        { label: 'Avg Rating', value: canteens.length > 0 ? (canteens.reduce((sum, c) => sum + c.rating, 0) / canteens.length).toFixed(1) : '0.0', color: 'bg-yellow-50 text-yellow-700' },
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
                                    <UtensilsIcon size={20} />
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
                                Showing {filteredCanteens.length} of {canteens.length} canteens
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-200">
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Canteen</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Address</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Manager</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Contact</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Menu Items</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Avg Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Rating</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCanteens.map((canteen, index) => (
                                        <motion.tr
                                            key={canteen.id}
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
                                                    />
                                                    <div>
                                                        <p className="font-medium text-surface-900">{canteen.name}</p>
                                                        <p className="text-sm text-surface-500">ID: #{canteen.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className="bg-surface-100 text-surface-700">
                                                    {canteen.type}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{canteen.address}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-surface-700">{canteen.manager}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-surface-700 text-sm">{canteen.contact}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-surface-700">{canteen.menuItems}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-medium text-surface-900">{canteen.avgPrice}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-1">
                                                    <StarIcon size={14} className="text-yellow-500 fill-yellow-500" />
                                                    <span className="text-surface-700">{canteen.rating}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={getStatusColor(canteen.status)}>
                                                    <span className="capitalize">{canteen.status}</span>
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm">
                                                        <EyeIcon size={14} />
                                                    </Button>
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

export default CanteensPage;
