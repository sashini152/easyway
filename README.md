# 🍽 SLIIT Eats - Complete Canteen Management System

A comprehensive food management system for SLIIT with real-time canteen data, news management, and offer tracking.

## 🏗️ System Architecture

### Backend (Node.js + Express + MongoDB)

- **RESTful API** with proper CRUD operations
- **JWT Authentication** for secure access control
- **Rate Limiting** for API protection
- **Data Validation** and error handling
- **Real-time Database** integration with Mongoose

### Frontend (React + Vite)

- **Modern UI** with Tailwind CSS
- **Responsive Design** for all devices
- **Real-time Data** fetching from backend
- **Interactive Components** with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd EasyWay
   ```

2. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend
   npm install
   ```

3. **Setup environment variables**

   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**

   ```bash
   cd backend
   npm run setup
   ```

5. **Start the applications**

   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

## 📊 Database Schema

### Canteens Collection

```javascript
{
  name: String (required),
  type: String (required),
  rating: Number (0-5),
  status: String (open/closed/maintenance),
  image: String (required),
  address: String (required),
  description: String (required),
  menuItems: Number,
  avgPrice: String,
  operatingHours: String,
  manager: String,
  contact: String,
  location: {
    type: String,
    coordinates: [Number, Number]
  },
  facilities: [String],
  socialMedia: {
    website: String,
    facebook: String,
    instagram: String
  }
}
```

### News Collection

```javascript
{
  title: String (required),
  excerpt: String (required),
  content: String (required),
  author: String (required),
  category: String (News/Health/Update/Feedback/Event/Announcement),
  image: String (required),
  views: Number,
  comments: [ObjectId],
  likes: [ObjectId],
  status: String (draft/published/archived),
  featured: Boolean,
  tags: [String],
  publishedAt: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}
```

### Offers Collection

```javascript
{
  title: String (required),
  description: String (required),
  discount: String (required),
  shopName: String (required),
  shop: ObjectId (ref: Canteen),
  validUntil: Date (required),
  category: String (student/combo/time/special/loyalty/seasonal/clearance),
  status: String (active/expired/upcoming/paused),
  usageLimit: String,
  minOrder: String,
  maxDiscount: String,
  applicableItems: [String],
  exclusions: [String],
  color: String,
  terms: String,
  priority: Number (1-10),
  redemptions: [Object],
  clickCount: Number,
  conversionRate: Number,
  revenue: Number
}
```

## 🌐 API Endpoints

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
- `POST /api/offers/:id/clicks` - Track offer clicks

## 🎨 Frontend Features

### Pages

- **Landing Page** - Beautiful hero section with animations
- **Canteens Management** - `/admin/canteens` - Full CRUD interface
- **News Management** - `/admin/news` - Blog system with rich editor
- **Offers Management** - `/admin/offers` - Promotional offers tracking
- **Reservations** - `/admin/reservations` - Table booking system
- **Dashboard** - Role-based dashboards for different user types

### Components

- **Unified Navbar** - Single navigation component
- **Responsive Cards** - Modern card layouts
- **Interactive Tables** - Sortable, filterable data tables
- **Forms** - Validated input forms
- **Animations** - Smooth transitions and micro-interactions

## 🔐 Authentication & Security

### User Roles

- **Super Admin** - Full system access
- **Shop Admin** - Canteen management
- **Canteen Admin** - Food service management
- **Canteen Owner** - Business owner access
- **Student** - Public access with limited features

### Security Features

- JWT tokens for authentication
- Rate limiting (100 requests/15 minutes)
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet.js

## 📱 Mobile Responsive

- **Mobile-First Design** - Optimized for all screen sizes
- **Touch-Friendly** - Large tap targets
- **Progressive Enhancement** - Works on all devices
- **Offline Support** - Service worker ready

## 🎯 Key Features

### Real-Time Updates

- Live canteen status updates
- Real-time offer notifications
- Dynamic pricing updates
- Live reservation tracking

### Analytics & Reporting

- Offer performance tracking
- User engagement metrics
- Popular item analytics
- Revenue reporting dashboard

### Search & Discovery

- Full-text search across all data
- Category-based filtering
- Location-based canteen discovery
- Advanced sorting options

## 🛠️ Development

### Environment Variables

```bash
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/easyway
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5178

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Available Scripts

```bash
# Backend
npm run dev          # Start development server
npm run start        # Start production server
npm run setup        # Populate database with sample data
npm run check        # Check database status

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📚 Documentation

### API Documentation

- Visit `http://localhost:5000/api-docs` for detailed API documentation
- Swagger/OpenAPI specifications included
- Interactive API testing interface

### Database Management

- MongoDB Compass connection strings provided
- Data migration scripts available
- Backup and restore procedures documented

## 🚀 Production Deployment

### Environment Setup

1. Configure production environment variables
2. Set up MongoDB Atlas or production database
3. Configure reverse proxy (Nginx/Apache)
4. Set up SSL certificates

### Build & Deploy

```bash
# Build frontend
cd frontend
npm run build

# Start production servers
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For support and questions:

- 📧 Technical Issues: Check GitHub Issues
- 📧 Feature Requests: Submit GitHub Discussions
- 📧 Documentation: Check README and Wiki
- 📧 Security: Report security issues privately

---

**🎉 Ready to transform SLIIT's dining experience with modern technology!**
