import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const SimpleArticleCreation = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'News',
    status: 'published'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        status: formData.status
      };

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
        setMessage('Article created successfully!');
        setFormData({
          title: '',
          content: '',
          category: 'News',
          status: 'published'
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/admin';
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
              type="button"
              variant="outline"
              onClick={() => window.location.href = '/admin'}
            >
              Back to Dashboard
            </Button>
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
