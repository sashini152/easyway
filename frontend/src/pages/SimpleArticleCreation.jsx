import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { canteenAPI } from '../services/api';

const SimpleArticleCreation = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'News',
    status: 'published',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userCanteen, setUserCanteen] = useState(null);

  // Fetch shop owner's canteen if user is a shop owner
  useEffect(() => {
    if (user?.role === 'shop_owner') {
      const fetchCanteen = async () => {
        try {
          const response = await canteenAPI.getShopOwnerCanteen();
          if (response.success && response.data) {
            setUserCanteen(response.data);
          }
        } catch (error) {
          console.error('Error fetching canteen:', error);
        }
      };
      fetchCanteen();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login first');
        return;
      }

      // Create article data
      const articleData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        status: formData.status,
        image: formData.image
      };

      // Add canteen association for shop owners
      if (user?.role === 'shop_owner' && userCanteen) {
        articleData.canteen = userCanteen._id;
        articleData.canteenName = userCanteen.name;
      }

      console.log('Creating article:', articleData);

      // Make API call
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (result.success) {
        const redirectMessage = user?.role === 'shop_owner' 
          ? 'Article created successfully! Redirecting to your dashboard...' 
          : 'Article created successfully! Redirecting to admin dashboard...';
        setMessage(redirectMessage);
        setFormData({
          title: '',
          content: '',
          category: 'News',
          status: 'published',
          image: ''
        });
        
        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
          if (user?.role === 'shop_owner') {
            window.location.href = '/shop-owner';
          } else {
            window.location.href = '/admin';
          }
        }, 2000);
      } else {
        setMessage('Failed to create article: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error creating article: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Article</h1>
        
        {/* Canteen Association Indicator for Shop Owners */}
        {user?.role === 'shop_owner' && userCanteen && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-900">
                This article will be published for: <strong>{userCanteen.name}</strong>
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Customers visiting your canteen will see this article
            </p>
          </div>
        )}
        
        {message && (
          <div className={`p-4 rounded-md mb-4 ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              rows={6}
              placeholder="Enter article content (minimum 50 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Food Review">Food Review</option>
              <option value="Campus Life">Campus Life</option>
              <option value="Health Tips">Health Tips</option>
              <option value="Events">Events</option>
              <option value="News">News</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Image URL or Base64
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg or data:image/jpeg;base64,..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter an image URL or paste a base64 image (jpg, jpeg, png, gif, webp)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-4">
           
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleArticleCreation;
