# EasyWay Backend API

A complete backend API for the SLIIT Eats canteen management system with MongoDB integration.

## Features

- **Canteens Management**: CRUD operations for canteen data
- **News/Blog Management**: Full-featured blog system with categories, views, likes, and comments
- **Offers Management**: Comprehensive offer system with tracking and analytics
- **Reservations Management**: Table reservation system with status tracking
- **Authentication**: JWT-based authentication system
- **Rate Limiting**: Built-in API rate limiting
- **Security**: Helmet.js for security headers
- **CORS**: Cross-origin resource sharing enabled

## Database Schema

### Canteens
- Basic info (name, type, rating, status)
- Location data (address, coordinates)
- Operating hours and contact info
- Manager details and social media links
- Facilities list

### News/Blog
- Article content (title, excerpt, content)
- Author and category management
- SEO metadata
- Views, likes, and comments tracking
- Featured article system

### Offers
- Offer details (title, description, discount)
- Shop association and category system
- Usage limits and restrictions
- Redemption tracking
- Analytics (clicks, conversions, revenue)

## API Endpoints

### Canteens
- `GET /api/canteens` - Get all canteens
- `GET /api/canteens/:id` - Get canteen by ID
- `POST /api/canteens` - Create new canteen
- `PUT /api/canteens/:id` - Update canteen
- `DELETE /api/canteens/:id` - Delete canteen

### News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get article by ID
- `POST /api/news` - Create new article
- `PUT /api/news/:id` - Update article
- `DELETE /api/news/:id` - Delete article
- `POST /api/news/:id/views` - Increment views

### Offers
- `GET /api/offers` - Get all offers
- `GET /api/offers/:id` - Get offer by ID
- `POST /api/offers` - Create new offer
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer
- `POST /api/offers/:id/clicks` - Increment click count

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and update:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/easyway
   JWT_SECRET=your_jwt_secret_here
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on localhost:27017

4. **Start Server**
   ```bash
   npm run dev
   ```

## Frontend Integration

The frontend has been updated to fetch data from the backend API instead of using hardcoded mock data. Key changes:

- Removed hardcoded mock data from components
- Added API calls to fetch real data
- Maintained the same UI/UX with proper loading states
- Added error handling for API failures

## Security Features

- JWT authentication for protected routes
- Rate limiting (100 requests per 15 minutes)
- Security headers with Helmet.js
- Input validation and sanitization
- CORS configuration for frontend integration

## Database Models

All models include:
- Timestamps for tracking creation and updates
- Proper data validation
- Reference relationships between models
- Indexes for performance optimization

## Development

The backend is designed to work seamlessly with the existing frontend while providing a robust, scalable API for data management.
