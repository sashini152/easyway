import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    CalendarIcon, 
    ClockIcon, 
    UsersIcon, 
    MapPinIcon,
    CheckIcon,
    XIcon,
    FilterIcon,
    SearchIcon,
    PlusIcon,
    EditIcon,
    TrashIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch reservations from API
        const fetchReservations = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/reservations');
                const data = await response.json();
                
                if (data.success) {
                    setReservations(data.data);
                    setFilteredReservations(data.data);
                } else {
                    console.error('Failed to fetch reservations:', data.message);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    useEffect(() => {
        let filtered = reservations;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(reservation =>
                reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.canteenName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(reservation => reservation.status === statusFilter);
        }

        setFilteredReservations(filtered);
    }, [searchTerm, statusFilter, reservations]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckIcon size={16} />;
            case 'pending':
                return <ClockIcon size={16} />;
            case 'cancelled':
                return <XIcon size={16} />;
            default:
                return <ClockIcon size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-surface-600">Loading reservations...</p>
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
                            <h1 className="text-2xl font-bold text-surface-900">Table Reservations</h1>
                            <p className="text-surface-600 mt-1">Manage and view all table reservations</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Search reservations..."
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
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <Button className="bg-brand-500 hover:bg-brand-600">
                                <PlusIcon size={16} className="mr-2" />
                                New Reservation
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: 'Total Reservations', value: reservations.length, color: 'bg-blue-50 text-blue-700' },
                        { label: 'Confirmed', value: reservations.filter(r => r.status === 'confirmed').length, color: 'bg-green-50 text-green-700' },
                        { label: 'Pending', value: reservations.filter(r => r.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
                        { label: 'Cancelled', value: reservations.filter(r => r.status === 'cancelled').length, color: 'bg-red-50 text-red-700' },
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
                                    <UsersIcon size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Reservations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Reservation Details</span>
                            <span className="text-sm font-normal text-surface-600">
                                Showing {filteredReservations.length} of {reservations.length} reservations
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-200">
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Customer</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Contact</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Canteen</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Date & Time</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Guests</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Special Requests</th>
                                        <th className="text-left py-3 px-4 font-semibold text-surface-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReservations.map((reservation, index) => (
                                        <motion.tr
                                            key={reservation.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-surface-900">{reservation.customerName}</p>
                                                    <p className="text-sm text-surface-500">ID: #{reservation.id}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-surface-700">{reservation.email}</p>
                                                    <p className="text-sm text-surface-500">{reservation.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{reservation.canteenName}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-surface-700">
                                                        <CalendarIcon size={16} className="text-surface-400" />
                                                        <span>{reservation.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-surface-700">
                                                        <ClockIcon size={16} className="text-surface-400" />
                                                        <span>{reservation.time}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <UsersIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{reservation.guests}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={getStatusColor(reservation.status)}>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(reservation.status)}
                                                        <span className="capitalize">{reservation.status}</span>
                                                    </div>
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-surface-600 max-w-xs truncate">
                                                    {reservation.specialRequests || 'None'}
                                                </p>
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

export default ReservationPage;
