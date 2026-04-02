import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MapPinIcon, 
    PhoneIcon, 
    MailIcon, 
    ClockIcon,
    StarIcon,
    SearchIcon,
    FilterIcon,
    HeartIcon,
    MessageCircleIcon,
    CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canteenAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserCanteenView = () => {
    const { user } = useAuth();
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [selectedCanteen, setSelectedCanteen] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        fetchCanteens();
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

        if (locationFilter) {
            filtered = filtered.filter(canteen =>
                canteen.location.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        setCanteens(filtered);
    }, [searchTerm, locationFilter]);

    const fetchCanteens = async () => {
        try {
            setLoading(true);
            const response = await canteenAPI.getAllCanteens();
            if (response.success) {
                setCanteens(response.data.canteens);
            }
        } catch (error) {
            console.error('Error fetching canteens:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (canteen) => {
        setSelectedCanteen(canteen);
        setShowDetailModal(true);
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await canteenAPI.addReview(selectedCanteen._id, reviewData);
            setShowReviewModal(false);
            setReviewData({ rating: 5, comment: '' });
            fetchCanteens();
            // Refresh selected canteen details
            const updatedCanteen = await canteenAPI.getCanteenById(selectedCanteen._id);
            if (updatedCanteen.success) {
                setSelectedCanteen(updatedCanteen.data);
            }
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    const isOpen = (canteen) => {
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
                            <h1 className="text-2xl font-bold text-surface-900">Campus Canteens</h1>
                            <p className="text-surface-600 mt-1">Discover dining options at SLIIT</p>
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
                            <div className="relative">
                                <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Filter by location..."
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="pl-10 w-48"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Canteens Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {canteens.map((canteen, index) => (
                        <motion.div
                            key={canteen._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="relative h-48 bg-surface-100">
                                    <img
                                        src={canteen.image}
                                        alt={canteen.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(canteen.name) + '&background=random&size=400';
                                        }}
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Badge className={isOpen(canteen) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                            {isOpen(canteen) ? 'Open' : 'Closed'}
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <h3 className="text-white font-bold text-lg">{canteen.name}</h3>
                                        <p className="text-white/90 text-sm">{canteen.location}</p>
                                    </div>
                                </div>
                                
                                <CardContent className="p-4">
                                    <p className="text-surface-600 text-sm mb-3 line-clamp-2">
                                        {canteen.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            <StarIcon size={16} className="text-yellow-500 fill-yellow-500" />
                                            <span className="font-medium text-surface-900">
                                                {canteen.averageRating?.toFixed(1) || '0.0'}
                                            </span>
                                            <span className="text-surface-500 text-sm">
                                                ({canteen.totalReviews || 0} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ClockIcon size={14} className="text-surface-400" />
                                            <span className="text-sm text-surface-600">
                                                {canteen.operatingHours.open} - {canteen.operatingHours.close}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon size={14} className="text-surface-400" />
                                            <span className="text-sm text-surface-600">{canteen.location}</span>
                                        </div>
                                        <Button
                                            onClick={() => handleViewDetails(canteen)}
                                            size="sm"
                                            className="bg-brand-500 hover:bg-brand-600"
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedCanteen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="relative h-64 bg-surface-100">
                            <img
                                src={selectedCanteen.image}
                                alt={selectedCanteen.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedCanteen.name) + '&background=random&size=600';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold">{selectedCanteen.name}</h2>
                                        <p className="text-white/90">{selectedCanteen.location}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={isOpen(selectedCanteen) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                            {isOpen(selectedCanteen) ? 'Open Now' : 'Closed'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-surface-900 mb-2">About</h3>
                                        <p className="text-surface-700">{selectedCanteen.description}</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-surface-900 mb-3">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <PhoneIcon size={18} className="text-surface-400" />
                                                <span>{selectedCanteen.contact.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MailIcon size={18} className="text-surface-400" />
                                                <span>{selectedCanteen.contact.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <ClockIcon size={18} className="text-surface-400" />
                                                <span>{selectedCanteen.operatingHours.open} - {selectedCanteen.operatingHours.close}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPinIcon size={18} className="text-surface-400" />
                                                <span>{selectedCanteen.address.street}, {selectedCanteen.address.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-surface-900 mb-3">Facilities</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCanteen.facilities.map((facility, index) => (
                                                <Badge key={index} className="bg-surface-100 text-surface-700">
                                                    {facility}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-surface-900">Menu Items</h3>
                                            <Button
                                                onClick={() => setShowReviewModal(true)}
                                                size="sm"
                                                className="bg-brand-500 hover:bg-brand-600"
                                            >
                                                Add Review
                                            </Button>
                                        </div>
                                        <div className="space-y-3">
                                            {selectedCanteen.menu?.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-surface-900">{item.name}</p>
                                                        <p className="text-sm text-surface-500">{item.category}</p>
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
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Rating & Reviews</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center mb-4">
                                                <div className="text-3xl font-bold text-surface-900 mb-1">
                                                    {selectedCanteen.averageRating?.toFixed(1) || '0.0'}
                                                </div>
                                                <div className="flex justify-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            size={16}
                                                            className={i < (selectedCanteen.averageRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-surface-600">
                                                    {selectedCanteen.totalReviews || 0} reviews
                                                </p>
                                            </div>
                                            
                                            <Button
                                                onClick={() => setShowReviewModal(true)}
                                                className="w-full bg-brand-500 hover:bg-brand-600"
                                            >
                                                Write a Review
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Reviews</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {selectedCanteen.reviews?.slice(0, 3).map((review, index) => (
                                                    <div key={index} className="border-b border-surface-100 pb-3 last:border-0">
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
                    </motion.div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md"
                    >
                        <h2 className="text-xl font-bold text-surface-900 mb-4">Write a Review</h2>
                        
                        <form onSubmit={handleAddReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Rating
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewData({...reviewData, rating: star})}
                                            className="p-1"
                                        >
                                            <StarIcon
                                                size={24}
                                                className={star <= reviewData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-2">
                                    Your Review *
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    required
                                    rows={4}
                                    placeholder="Share your experience..."
                                />
                            </div>
                            
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setReviewData({ rating: 5, comment: '' });
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-brand-500 hover:bg-brand-600">
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default UserCanteenView;
