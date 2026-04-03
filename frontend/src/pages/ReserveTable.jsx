import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Star, ArrowLeft, Calendar } from 'lucide-react';
import { canteenAPI } from '../services/api';
import ReservationForm from '../components/ReservationForm';

const ReserveTable = () => {
    const { canteenId } = useParams();
    const [canteen, setCanteen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [reservationSuccess, setReservationSuccess] = useState(null);

    const fetchCanteenDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await canteenAPI.getCanteenById(canteenId);
            if (response.success) {
                setCanteen(response.data);
            } else {
                setError('Canteen not found');
            }
        } catch (error) {
            console.error('Error fetching canteen details:', error);
            setError('Failed to load canteen details');
        } finally {
            setLoading(false);
        }
    }, [canteenId]);

    useEffect(() => {
        fetchCanteenDetails();
    }, [fetchCanteenDetails]);

    const handleReservationSuccess = (reservation) => {
        setReservationSuccess(reservation);
        setShowReservationForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !canteen) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Canteen Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (reservationSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h2>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">Confirmation Code</p>
                            <p className="text-xl font-bold text-blue-600">{reservationSuccess.confirmationCode}</p>
                        </div>
                        <div className="text-left space-y-2 mb-6">
                            <p className="text-sm text-gray-600">
                                <strong>Date:</strong> {new Date(reservationSuccess.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Time:</strong> {reservationSuccess.time}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Party Size:</strong> {reservationSuccess.partySize} guests
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Canteen:</strong> {reservationSuccess.canteen.name}
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            Please save your confirmation code. You'll need it when you arrive.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setShowReservationForm(true)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Make Another Reservation
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Reserve a Table</h1>
                        <div></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Canteen Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {canteen.image && (
                                <img
                                    src={canteen.image}
                                    alt={canteen.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{canteen.name}</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{canteen.location}</span>
                                    </div>
                                    
                                    {canteen.contact?.phone && (
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="h-4 w-4 mr-2" />
                                            <span className="text-sm">{canteen.contact.phone}</span>
                                        </div>
                                    )}
                                    
                                    {canteen.contact?.email && (
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="h-4 w-4 mr-2" />
                                            <span className="text-sm">{canteen.contact.email}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {canteen.operatingHours?.open || '08:00'} - {canteen.operatingHours?.close || '20:00'}
                                        </span>
                                    </div>
                                </div>

                                {canteen.description && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                                        <p className="text-gray-600 text-sm">{canteen.description}</p>
                                    </div>
                                )}

                                {/* Rating */}
                                <div className="flex items-center mb-6">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${
                                                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600">4.0 (128 reviews)</span>
                                </div>

                                {/* Operating Hours */}
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Operating Hours</h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Monday - Friday: {canteen.operatingHours?.open || '08:00'} - {canteen.operatingHours?.close || '20:00'}</p>
                                        <p>Saturday - Sunday: {canteen.operatingHours?.open || '08:00'} - {canteen.operatingHours?.close || '20:00'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reservation Form */}
                    <div className="lg:col-span-2">
                        {!showReservationForm ? (
                            <div className="bg-white rounded-lg shadow-lg p-8">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reserve Your Table</h2>
                                    <p className="text-gray-600">
                                        Book a table at {canteen.name} and enjoy a wonderful dining experience.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Calendar className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Choose Date</h3>
                                        <p className="text-sm text-gray-600">Select your preferred date</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Clock className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Select Time</h3>
                                        <p className="text-sm text-gray-600">Pick an available time slot</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Party Size</h3>
                                        <p className="text-sm text-gray-600">Number of guests</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setShowReservationForm(true)}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                    >
                                        Make Reservation
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ReservationForm
                                canteenId={canteenId}
                                onSuccess={handleReservationSuccess}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReserveTable;
