import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MessageSquare } from 'lucide-react';
import { reservationAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ReservationForm = ({ canteenId, onSuccess }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        customer: {
            name: '',
            email: '',
            phone: ''
        },
        date: '',
        time: '',
        partySize: 1,
        specialRequests: ''
    });

    // Auto-fill user data when component mounts
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customer: {
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || ''
                }
            }));
        }
    }, [user]);

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Get today's date in YYYY-MM-DD format
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Fetch available time slots when date is selected
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await reservationAPI.getAvailableTimeSlots(canteenId, formData.date);
                if (response.success) {
                    setAvailableSlots(response.data.availableSlots);
                }
            } catch (error) {
                console.error('Error fetching available slots:', error);
            }
        };

        if (formData.date && canteenId) {
            fetchAvailableSlots();
        }
    }, [formData.date, canteenId]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customer.name.trim()) {
            newErrors.customerName = 'Name is required';
        }

        if (!formData.customer.email.trim()) {
            newErrors.customerEmail = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.customer.email)) {
            newErrors.customerEmail = 'Email is invalid';
        }

        if (!formData.customer.phone.trim()) {
            newErrors.customerPhone = 'Phone is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        if (!formData.time) {
            newErrors.time = 'Time is required';
        }

        if (formData.partySize < 1 || formData.partySize > 20) {
            newErrors.partySize = 'Party size must be between 1 and 20';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            console.log('🔍 ReservationForm: Submitting reservation', { formData, canteenId });
            const response = await reservationAPI.createReservation({
                ...formData,
                canteen: canteenId
            });
            
            console.log('🔍 ReservationForm: API response', response);
            
            if (response.success) {
                onSuccess(response.data);
                // Reset form
                setFormData({
                    customer: { name: '', email: '', phone: '' },
                    date: '',
                    time: '',
                    partySize: 1,
                    specialRequests: ''
                });
                setAvailableSlots([]);
            } else {
                setErrors({ submit: response.message || 'Failed to create reservation' });
            }
        } catch (error) {
            console.error('🔍 ReservationForm: Error creating reservation', error);
            setErrors({ submit: error.message || 'Failed to create reservation. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCustomerChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            customer: {
                ...prev.customer,
                [field]: value
            }
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Make a Reservation</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={formData.customer.name}
                                onChange={(e) => handleCustomerChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                            />
                            {errors.customerName && (
                                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.customer.email}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                placeholder="your@email.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email is automatically filled from your account</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                value={formData.customer.phone}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                                placeholder="+1234567890"
                            />
                            <p className="text-xs text-gray-500 mt-1">Phone is automatically filled from your account</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Party Size *
                            </label>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 text-gray-500 mr-2" />
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.partySize}
                                    onChange={(e) => handleInputChange('partySize', parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {errors.partySize && (
                                <p className="text-red-500 text-sm mt-1">{errors.partySize}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Reservation Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                min={getMinDate()}
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time *
                            </label>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                                <select
                                    value={formData.time}
                                    onChange={(e) => handleInputChange('time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!formData.date || availableSlots.length === 0}
                                >
                                    <option value="">Select time</option>
                                    {availableSlots.map(slot => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.time && (
                                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                            )}
                            {formData.date && availableSlots.length === 0 && (
                                <p className="text-gray-500 text-sm mt-1">No available slots for this date</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Requests
                        </label>
                        <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                            <textarea
                                value={formData.specialRequests}
                                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Any special dietary requirements or preferences..."
                                maxLength="500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({
                                customer: { name: '', email: '', phone: '' },
                                date: '',
                                time: '',
                                partySize: 1,
                                specialRequests: ''
                            });
                            setErrors({});
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Make Reservation'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;
