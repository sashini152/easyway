import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { reservationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ReservationManagement = ({ canteenId }) => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            if (!user || !canteenId) {
                console.log('🔍 ReservationManagement: Missing user or canteenId', { user: user?.name, canteenId });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                console.log('🔍 ReservationManagement: Fetching reservations', { 
                    userName: user.name, 
                    userRole: user.role, 
                    canteenId,
                    selectedDate,
                    statusFilter 
                });
                
                const params = {};
                if (canteenId) params.canteenId = canteenId;
                if (selectedDate) params.date = selectedDate;
                if (statusFilter !== 'all') params.status = statusFilter;

                const response = await reservationAPI.getReservations(params);
                console.log('🔍 ReservationManagement: API response', response);
                
                if (response.success) {
                    console.log('🔍 ReservationManagement: Reservations loaded', response.data.length);
                    setReservations(response.data);
                    setFilteredReservations(response.data);
                } else {
                    console.error('Failed to fetch reservations:', response.message);
                }
            } catch (error) {
                console.error('🔍 ReservationManagement: Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [canteenId, selectedDate, statusFilter, user]);

    // Update reservation status
    const updateStatus = async (reservationId, newStatus) => {
        console.log('🔍 ReservationManagement: Updating status', { reservationId, newStatus });
        try {
            const response = await reservationAPI.updateReservationStatus(reservationId, newStatus);
            console.log('🔍 ReservationManagement: API response', response);
            if (response.success) {
                // Update local state
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
            console.error('🔍 ReservationManagement: Error updating reservation:', error);
            alert('Failed to update reservation. Please try again.');
        }
    };

    // Delete reservation
    const deleteReservation = async (reservationId) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                const response = await reservationAPI.deleteReservation(reservationId);
                if (response.success) {
                    // Update local state
                    setReservations(prev => prev.filter(res => res._id !== reservationId));
                    setFilteredReservations(prev => prev.filter(res => res._id !== reservationId));
                    alert('Reservation cancelled successfully!');
                }
            } catch (error) {
                console.error('Error cancelling reservation:', error);
                alert('Failed to cancel reservation. Please try again.');
            }
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = reservations;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(res => 
                res.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredReservations(filtered);
    }, [searchTerm, reservations]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <AlertCircle className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
            case 'completed':
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    if (!user) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Authentication Required</h3>
                    <p className="text-gray-500">Please log in to view reservations</p>
                </div>
            </div>
        );
    }

    if (!canteenId) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Canteen Assigned</h3>
                    <p className="text-gray-500">Please contact an administrator to assign a canteen to your account</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Reservations</h2>
                </div>
                <div className="text-sm text-gray-600">
                    {filteredReservations.length} reservation{filteredReservations.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        setSelectedDate('');
                        setStatusFilter('all');
                        setSearchTerm('');
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Clear Filters
                </button>
            </div>

            {/* Reservations List */}
            {filteredReservations.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reservations Found</h3>
                    <p className="text-gray-500">
                        {searchTerm || selectedDate || statusFilter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'No reservations have been made yet'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReservations.map((reservation) => (
                        <div key={reservation._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                            {getStatusIcon(reservation.status)}
                                            <span className="ml-1">{reservation.status}</span>
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            Code: {reservation.confirmationCode}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{reservation.customer.name}</h4>
                                            <p className="text-sm text-gray-600">{reservation.customer.email}</p>
                                            <p className="text-sm text-gray-600">{reservation.customer.phone}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center justify-end mb-1">
                                                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-sm text-gray-900">
                                                    {new Date(reservation.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-end mb-1">
                                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-sm text-gray-900">{reservation.time}</span>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <Users className="h-4 w-4 text-gray-500 mr-1" />
                                                <span className="text-sm text-gray-900">{reservation.partySize} guests</span>
                                            </div>
                                        </div>
                                    </div>

                                    {reservation.specialRequests && (
                                        <div className="bg-gray-50 rounded p-2 mb-3">
                                            <p className="text-sm text-gray-700">
                                                <strong>Special Requests:</strong> {reservation.specialRequests}
                                            </p>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-500">
                                        Booked on {new Date(reservation.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-2 ml-4">
                                    {reservation.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(reservation._id, 'confirmed')}
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => deleteReservation(reservation._id)}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {reservation.status === 'confirmed' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(reservation._id, 'completed')}
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            >
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => deleteReservation(reservation._id)}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    {reservation.status === 'cancelled' && (
                                        <span className="text-xs text-gray-500">Cancelled</span>
                                    )}
                                    {reservation.status === 'completed' && (
                                        <span className="text-xs text-green-600">Completed</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationManagement;
