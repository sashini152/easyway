import React, { useState, useEffect, useCallback } from 'react';
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
import { reservationAPI, canteenAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ReservationForm from '../components/ReservationForm';

const ReservationPage = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedCanteenId, setSelectedCanteenId] = useState(null);
    const [canteens, setCanteens] = useState([]);

    // Fetch canteens
    const fetchCanteens = useCallback(async () => {
        console.log('🔍 fetchCanteens: Starting fetch...');
        try {
            const response = await canteenAPI.getAllCanteens();
            console.log('🔍 fetchCanteens: API response', response);
            if (response.success && response.data && Array.isArray(response.data.canteens)) {
                console.log('🔍 fetchCanteens: Canteens loaded', response.data.canteens.length);
                setCanteens(response.data.canteens);
                // Set default canteen if none selected
                if (!selectedCanteenId && response.data.canteens.length > 0) {
                    console.log('🔍 fetchCanteens: Setting default canteen', response.data.canteens[0]._id);
                    setSelectedCanteenId(response.data.canteens[0]._id);
                }
            } else {
                console.error('🔍 fetchCanteens: Invalid response format', response);
                setCanteens([]); // Set to empty array to prevent errors
            }
        } catch (error) {
            console.error('🔍 fetchCanteens: Error fetching canteens:', error);
            setCanteens([]); // Set to empty array to prevent errors
        }
    }, [selectedCanteenId]);

    useEffect(() => {
        fetchCanteens();
    }, [fetchCanteens]);

    const handleNewReservation = () => {
        console.log('🔍 handleNewReservation: Called', { userRole: user?.role, canteensLength: canteens.length, selectedCanteenId });
        
        if (user?.role === 'super_admin') {
            // Super admin needs to select a canteen
            if (canteens.length === 0) {
                alert('No canteens available. Please create a canteen first in the Super Admin Dashboard.');
                return;
            }
            if (!selectedCanteenId) {
                alert('Please select a canteen from the dropdown menu first.');
                return;
            }
        } else if (user?.role === 'user') {
            // Regular users need to select a canteen to make reservation
            if (canteens.length === 0) {
                alert('No canteens available. Please contact an administrator.');
                return;
            }
            if (!selectedCanteenId) {
                alert('Please select a canteen from the dropdown menu first.');
                return;
            }
        }
        
        console.log('🔍 handleNewReservation: Opening modal for canteen', selectedCanteenId);
        setShowReservationModal(true);
    };

    const handleReservationSuccess = (newReservation) => {
        // Add the new reservation to the list
        setReservations(prev => [newReservation, ...prev]);
        setShowReservationModal(false);
    };

    const handleDeleteReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                const response = await reservationAPI.deleteReservation(reservationId);
                if (response.success) {
                    setReservations(prev => prev.filter(res => res._id !== reservationId));
                    alert('Reservation deleted successfully!');
                } else {
                    alert('Failed to delete reservation: ' + response.message);
                }
            } catch (error) {
                console.error('Error deleting reservation:', error);
                alert('Failed to delete reservation. Please try again.');
            }
        }
    };

    const handleUpdateStatus = async (reservationId, newStatus) => {
        try {
            const response = await reservationAPI.updateReservationStatus(reservationId, newStatus);
            if (response.success) {
                setReservations(prev => 
                    prev.map(res => 
                        res._id === reservationId 
                            ? { ...res, status: newStatus }
                            : res
                    )
                );
                alert(`Reservation ${newStatus} successfully!`);
            } else {
                alert('Failed to update reservation: ' + response.message);
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
            alert('Failed to update reservation. Please try again.');
        }
    };

    useEffect(() => {
        // Fetch reservations from API
        const fetchReservations = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const params = {};
                if (selectedCanteenId) {
                    params.canteenId = selectedCanteenId;
                }
                
                console.log('🔍 fetchReservations: Making API call', { userRole: user.role, userEmail: user.email, params });
                const response = await reservationAPI.getReservations(params);
                console.log('🔍 fetchReservations: API response', response);
                
                if (response.success) {
                    console.log('🔍 fetchReservations: Reservations loaded', response.data.length);
                    setReservations(response.data);
                    setFilteredReservations(response.data);
                } else {
                    console.error('Failed to fetch reservations:', response.message);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user, selectedCanteenId]);

    useEffect(() => {
        let filtered = reservations;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(reservation =>
                reservation.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (reservation.canteen?.name && reservation.canteen.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                reservation.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (!user) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UsersIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">Please log in to view and manage reservations</p>
                        <Button className="bg-brand-500 hover:bg-brand-600">
                            Go to Login
                        </Button>
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
                            <h1 className="text-2xl font-bold text-surface-900">Table Reservations</h1>
                            <p className="text-surface-600 mt-1">Manage and view all table reservations</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Canteen Selector - For super admin and regular users */}
                            {(user?.role === 'super_admin' || user?.role === 'user') && (
                                <div className="flex items-center gap-2">
                                    <MapPinIcon size={16} className="text-surface-400" />
                                    <select
                                        value={selectedCanteenId || ''}
                                        onChange={(e) => setSelectedCanteenId(e.target.value)}
                                        className="border border-surface-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[150px]"
                                    >
                                        <option value="">{user?.role === 'super_admin' ? 'All Canteens' : 'Select Canteen'}</option>
                                        {!Array.isArray(canteens) || canteens.length === 0 ? (
                                            <option value="" disabled>Loading canteens...</option>
                                        ) : (
                                            canteens.map(canteen => (
                                                <option key={canteen._id} value={canteen._id}>
                                                    {canteen.name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            )}
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
                            <Button className="bg-brand-500 hover:bg-brand-600" onClick={handleNewReservation}>
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
                    ].map((stat) => (
                        <div
                            key={stat.label}
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
                        </div>
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
                                    {filteredReservations.map((reservation) => (
                                        <tr
                                            key={reservation._id}
                                            className="border-b border-surface-100 hover:bg-surface-50 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-surface-900">{reservation.customer.name}</p>
                                                    <p className="text-sm text-surface-500">Code: {reservation.confirmationCode}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-surface-700">{reservation.customer.email}</p>
                                                    <p className="text-sm text-surface-500">{reservation.customer.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon size={16} className="text-surface-400" />
                                                    <span className="text-surface-700">{reservation.canteen?.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-surface-700">
                                                        <CalendarIcon size={16} className="text-surface-400" />
                                                        <span>{new Date(reservation.date).toLocaleDateString()}</span>
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
                                                    <span className="text-surface-700">{reservation.partySize}</span>
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
                                                    {user?.role === 'super_admin' && (
                                                        <>
                                                            {reservation.status === 'pending' && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="text-green-600 hover:text-green-700"
                                                                    onClick={() => handleUpdateStatus(reservation._id, 'confirmed')}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                            )}
                                                            {reservation.status === 'confirmed' && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="text-blue-600 hover:text-blue-700"
                                                                    onClick={() => handleUpdateStatus(reservation._id, 'completed')}
                                                                >
                                                                    Complete
                                                                </Button>
                                                            )}
                                                        </>
                                                    )}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => handleDeleteReservation(reservation._id)}
                                                    >
                                                        <TrashIcon size={14} />
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
            </div>
            
            {/* Reservation Modal */}
            {showReservationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">New Reservation</h2>
                            <Button
                                variant="ghost"
                                onClick={() => setShowReservationModal(false)}
                            >
                                <XIcon size={20} />
                            </Button>
                        </div>
                        <ReservationForm
                            canteenId={selectedCanteenId}
                            onSuccess={handleReservationSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationPage;
