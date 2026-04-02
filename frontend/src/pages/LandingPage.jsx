import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowRightIcon, 
    UtensilsIcon, 
    CalendarCheckIcon, 
    HeartIcon, 
    StarIcon, 
    ChevronRightIcon,
    ClockIcon,
    MapPinIcon,
    TagIcon,
    TrendingUpIcon,
    UsersIcon,
    MessageCircleIcon,
    EyeIcon
} from 'lucide-react';
import { canteenAPI } from '../services/api';

const FEATURED_MEALS = [
    { id: 1, name: 'Jollof Rice & Chicken', vendor: "Mama's Kitchen", price: '₦1,500', rating: 4.8, emoji: '🍛', color: 'from-orange-400 to-red-500' },
    { id: 2, name: 'Fresh Fruit Smoothie', vendor: 'Smoothie Bar', price: '₦800', rating: 4.9, emoji: '🥤', color: 'from-pink-400 to-rose-500' },
    { id: 3, name: 'Grilled Chicken Salad', vendor: 'Fresh & Green', price: '₦2,000', rating: 4.7, emoji: '🥗', color: 'from-green-400 to-emerald-500' },
    { id: 4, name: 'Spicy Shawarma', vendor: 'The Grill House', price: '₦1,200', rating: 4.6, emoji: '🌯', color: 'from-yellow-400 to-orange-500' },
    { id: 5, name: 'Beef Burger & Fries', vendor: 'Campus Bites', price: '₦2,500', rating: 4.5, emoji: '🍔', color: 'from-amber-400 to-orange-600' },
    { id: 6, name: 'Vegetable Pasta', vendor: "Mama's Kitchen", price: '₦1,800', rating: 4.4, emoji: '🍝', color: 'from-red-400 to-orange-500' },
    { id: 7, name: 'Chicken Fajita', vendor: 'The Grill House', price: '₦2,200', rating: 4.7, emoji: '🌮', color: 'from-orange-400 to-red-500' },
];

const CANTEENS = [
    { 
        id: 1, 
        name: "Main Canteen", 
        type: 'Local Cuisine', 
        rating: 4.8, 
        status: 'open',
        image: 'https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'Main Building, SLIIT',
        description: 'The main canteen serving a variety of Sri Lankan and international cuisine',
        menuItems: 45,
        avgPrice: '₦350'
    },
    { 
        id: 2, 
        name: 'Engineering Canteen', 
        type: 'Fast Food', 
        rating: 4.5, 
        status: 'open',
        image: 'https://images.unsplash.com/photo-1512058764286-8bb0250b91d5?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'Engineering Faculty, SLIIT',
        description: 'Specializing in quick meals for engineering students',
        menuItems: 32,
        avgPrice: '₦280'
    },
    { 
        id: 3, 
        name: 'Business School Canteen', 
        type: 'Healthy & Salads', 
        rating: 4.7, 
        status: 'open',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'Business School, SLIIT',
        description: 'Fresh and healthy options for business students',
        menuItems: 28,
        avgPrice: '₦320'
    },
    { 
        id: 4, 
        name: 'IT Faculty Canteen', 
        type: 'Tech Cafe', 
        rating: 4.6, 
        status: 'open',
        image: 'https://images.unsplash.com/photo-1555939594-58d6cb2a4003?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'IT Faculty, SLIIT',
        description: 'Modern cafe with tech-themed decor and high-speed WiFi',
        menuItems: 35,
        avgPrice: '₦380'
    },
    { 
        id: 5, 
        name: 'Student Center Cafe', 
        type: 'Grill & BBQ', 
        rating: 4.6, 
        status: 'open',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'Student Center, SLIIT',
        description: 'Premium grill and BBQ options for meat lovers',
        menuItems: 28,
        avgPrice: '₦450'
    },
];

const BLOG_POSTS = [
    {
        id: 1,
        title: "New Menu Items at Main Canteen",
        excerpt: "Exciting new dishes added to our main canteen menu this semester...",
        author: "Admin",
        category: "News",
        image: "https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
        views: 1234,
        comments: 45,
        date: "2 days ago"
    },
    {
        id: 2,
        title: "Healthy Eating Tips for Students",
        excerpt: "Discover how to maintain a balanced diet while studying...",
        author: "Nutrition Team",
        category: "Health",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
        views: 892,
        comments: 23,
        date: "5 days ago"
    },
    {
        id: 3,
        title: "Canteen Operating Hours Update",
        excerpt: "Important changes to canteen operating hours during exam period...",
        author: "Admin",
        category: "Update",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
        views: 567,
        comments: 12,
        date: "1 week ago"
    },
];

const OFFERS = [
    {
        id: 1,
        title: "Student Special - 20% Off",
        description: "Get 20% off on all meals with valid student ID",
        discount: "20%",
        shopName: "Main Canteen",
        validUntil: "2024-12-31",
        category: "student",
        color: "from-blue-500 to-purple-500",
        icon: TagIcon
    },
    {
        id: 2,
        title: "Combo Meal Deal",
        description: "Rice + Curry + Drink for only Rs. 350",
        discount: "Rs. 350",
        shopName: "Engineering Canteen",
        validUntil: "2024-11-30",
        category: "combo",
        color: "from-orange-500 to-red-500",
        icon: TrendingUpIcon
    },
    {
        id: 3,
        title: "Happy Hour - 15% Off",
        description: "15% off on all items between 2-4 PM",
        discount: "15%",
        shopName: "Business School Canteen",
        validUntil: "2024-12-15",
        category: "time",
        color: "from-green-500 to-teal-500",
        icon: ClockIcon
    },
    {
        id: 4,
        title: "Weekend Special",
        description: "Buy 1 Get 1 Free on selected items",
        discount: "BOGO",
        shopName: "The Grill House",
        validUntil: "2024-12-25",
        category: "special",
        color: "from-pink-500 to-rose-500",
        icon: HeartIcon
    },
];

const VENDORS = [
    { id: 1, name: "Mama's Kitchen", type: 'Local Cuisine', rating: 4.8 },
    { id: 2, name: 'Smoothie Bar', type: 'Beverages', rating: 4.9 },
    { id: 3, name: 'Fresh & Green', type: 'Salads & Healthy', rating: 4.7 },
    { id: 4, name: 'The Grill House', type: 'Grill & BBQ', rating: 4.6 },
    { id: 5, name: 'Campus Bites', type: 'Fast Food', rating: 4.5 },
    { id: 6, name: 'Pastry Corner', type: 'Desserts & Bakery', rating: 4.8 },
];

export function LandingPage() {
    const [canteens, setCanteens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCanteens();
    }, []);

    const fetchCanteens = async () => {
        try {
            setLoading(true);
            const response = await canteenAPI.getAllCanteens();
            if (response.success) {
                // Transform canteen data to match the landing page format
                const transformedCanteens = response.data.canteens.map(canteen => ({
                    id: canteen._id,
                    name: canteen.name,
                    type: canteen.description?.substring(0, 20) + '...' || 'Local Cuisine',
                    rating: canteen.rating || 4.5,
                    status: canteen.status === 'active' ? 'open' : 'closed',
                    image: canteen.image,
                    address: `${canteen.address?.street || 'N/A'}, ${canteen.address?.city || 'N/A'}`,
                    description: canteen.description,
                    menuItems: Math.floor(Math.random() * 50) + 20, // Random number for demo
                    avgPrice: '₦' + (Math.floor(Math.random() * 200) + 200)
                }));
                setCanteens(transformedCanteens);
            }
        } catch (error) {
            console.error('Error fetching canteens:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading canteens...</p>
                </div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    };
    return (<div className="min-h-screen bg-surface-50 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-brand-200/40 blur-3xl"/>
          <div className="absolute top-[20%] right-[-5%] w-[35%] h-[50%] rounded-full bg-warm-200/40 blur-3xl"/>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-success-100/40 blur-3xl"/>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 font-medium text-sm mb-6 border border-brand-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Now serving 4+ campus locations
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-surface-900 tracking-tight mb-6 leading-tight">
              Eat{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-warm-500">
                Balanced Meals
              </span>{' '}
              Every Day.
            </h1>

            <p className="text-lg md:text-xl text-surface-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Skip the lines. Reserve your table, order ahead, and enjoy
              delicious meals from your favorite campus vendors without the
              wait.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/canteens">
                <button className="w-full sm:w-auto group inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 focus:ring-brand-500 shadow-soft px-8 py-3.5 text-lg">
                  Browse Canteens
                  <ArrowRightIcon className="ml-2 group-hover:translate-x-1 transition-transform" size={18}/>
                </button>
              </Link>
              <Link to="/offers">
                <button className="w-full sm:w-auto inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 focus:ring-surface-200 px-8 py-3.5 text-lg">
                  View Offers
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[ { label: 'Active Students', value: '5,000+' }, { label: 'Food Vendors', value: '4+' }, { label: 'Meals Served', value: '50k+' } ].map((stat, i) => (<div key={i} className="bg-surface-0/60 backdrop-blur-sm border-surface-200/50 rounded-2xl overflow-hidden shadow-card border p-6">
                <div className="text-3xl font-bold text-surface-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-surface-500">
                  {stat.label}
                </div>
              </div>))}
          </motion.div>
        </div>
      </section>

      {/* Canteens Section */}
      <section className="py-24 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Our Campus Canteens
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Discover diverse dining options across our campus locations
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {canteens.map((canteen) => (<motion.div key={canteen.id} variants={itemVariants}>
                <div className="bg-surface-0 rounded-2xl shadow-card border border-surface-100 overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={canteen.image}
                      alt={canteen.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        canteen.status === 'open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {canteen.status === 'open' ? '● Open' : '● Closed'}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-surface-900 line-clamp-1">
                        {canteen.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-surface-100 px-2 py-1 rounded-md text-sm font-medium text-surface-700">
                        <StarIcon size={14} className="text-warm-500 fill-warm-500"/>
                        {canteen.rating}
                      </div>
                    </div>
                    <p className="text-surface-500 text-sm mb-2 line-clamp-2">
                      {canteen.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-surface-500 mb-4">
                      <MapPinIcon size={12} />
                      <span>{canteen.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-surface-600 mb-4">
                      <span>{canteen.menuItems} items</span>
                      <span>Avg: {canteen.avgPrice}</span>
                    </div>
                    <div className="mt-auto pt-4 border-t border-surface-100">
                      <Link to={`/canteens/${canteen.id}`}>
                        <button className="w-full inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 focus:ring-surface-200 px-4 py-2 text-sm">
                          View Menu
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </motion.div>

          <div className="mt-12 text-center">
            <Link to="/canteens">
              <button className="inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 focus:ring-brand-500 shadow-soft px-8 py-3.5 text-lg">
                View All Canteens
                <ChevronRightIcon className="ml-2" size={20}/>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog & Views Section */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
                Blog & Updates
              </h2>
              <p className="text-lg text-surface-600">
                Stay updated with the latest news and articles
              </p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center text-brand-600 font-medium hover:text-brand-700 transition-colors">
              View all posts <ChevronRightIcon size={20}/>
            </Link>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (<motion.div key={post.id} variants={itemVariants}>
                <div className="bg-surface-0 rounded-2xl shadow-card border border-surface-100 overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <div className="bg-brand-100 text-brand-700 px-2 py-1 rounded-md text-xs font-medium">
                        {post.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-surface-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-surface-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-surface-500 mb-4">
                      <span>By {post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-surface-600 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <EyeIcon size={14} />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircleIcon size={14} />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-surface-100">
                      <Link to={`/blog/${post.id}`}>
                        <button className="w-full inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 focus:ring-surface-200 px-4 py-2 text-sm">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/blog">
              <button className="w-full inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 focus:ring-surface-200 px-5 py-2.5 text-base">
                View all posts
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-24 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
              Special Offers & Deals
            </h2>
            <p className="text-lg text-surface-600 max-w-2xl mx-auto">
              Get the best deals on your favorite campus meals
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFERS.map((offer) => (<motion.div key={offer.id} variants={itemVariants}>
                <div className="bg-surface-0 rounded-2xl shadow-card border border-surface-100 overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer">
                  <div className={`h-32 w-full bg-gradient-to-br ${offer.color} flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-500`}>
                    <offer.icon size={48} />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-surface-900 line-clamp-1">
                        {offer.title}
                      </h3>
                      <div className="bg-brand-100 text-brand-700 px-2 py-1 rounded-md text-sm font-bold">
                        {offer.discount}
                      </div>
                    </div>
                    <p className="text-surface-600 text-sm mb-4 line-clamp-2">
                      {offer.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-surface-500 mb-4">
                      <ClockIcon size={12} />
                      <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm text-surface-500 mb-4">
                      At: {offer.shopName}
                    </div>
                    <div className="mt-auto pt-4 border-t border-surface-100">
                      <Link to="/offers">
                        <button className="w-full inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 focus:ring-brand-500 shadow-soft px-4 py-2 text-sm">
                          Claim Offer
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </motion.div>

          <div className="mt-12 text-center">
            <Link to="/offers">
              <button className="inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-brand-500 to-brand-400 text-white hover:from-brand-600 hover:to-brand-500 focus:ring-brand-500 shadow-soft px-8 py-3.5 text-lg">
                View All Offers
                <ChevronRightIcon className="ml-2" size={20}/>
              </button>
            </Link>
          </div>
        </div>
      </section>

        {/* Featured Meals */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">
                Popular Right Now
              </h2>
              <p className="text-lg text-surface-600">
                What students are loving today.
              </p>
            </div>
            <Link to="/menu" className="hidden sm:flex items-center text-brand-600 font-medium hover:text-brand-700 transition-colors">
              View full menu <ChevronRightIcon size={20}/>
            </Link>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_MEALS.map((meal) => (<motion.div key={meal.id} variants={itemVariants}>
                <div className="bg-surface-0 rounded-2xl shadow-card border border-surface-100 overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer">
                  <div className={`h-48 w-full bg-gradient-to-br ${meal.color} flex items-center justify-center text-7xl group-hover:scale-105 transition-transform duration-500`}>
                    {meal.emoji}
                  </div>
                  <div className="p-6 flex flex-col flex-1 bg-surface-0 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-surface-900 line-clamp-1">
                        {meal.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-surface-100 px-2 py-1 rounded-md text-sm font-medium text-surface-700">
                        <StarIcon size={14} className="text-warm-500 fill-warm-500"/>
                        {meal.rating}
                      </div>
                    </div>
                    <p className="text-surface-500 text-sm mb-4">
                      {meal.vendor}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-100">
                      <span className="text-xl font-bold text-surface-900">
                        {meal.price}
                      </span>
                      <Link to="/login">
                        <button className="inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 focus:ring-surface-200 px-3 py-1.5 text-sm">
                          Order
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/menu">
              <button className="w-full inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-surface-0 text-surface-800 border-2 border-surface-200 hover:border-brand-500 hover:text-brand-600 focus:ring-surface-200 px-5 py-2.5 text-base">
                View full menu
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors (Horizontal Scroll) */}
      <section className="py-24 bg-surface-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-12 text-center">
            Top Rated Vendors
          </h2>

          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x hide-scrollbar">
            {VENDORS.map((vendor) => (<div key={vendor.id} className="bg-surface-0 rounded-2xl overflow-hidden shadow-card border border-surface-100 p-6 min-w-[280px] sm:min-w-[320px] snap-center shrink-0 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-100 text-brand-700 relative inline-flex items-center justify-center rounded-full overflow-hidden font-semibold border-2 border-surface-0 shadow-sm w-12 h-12 text-base">
                    <span>{vendor.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-surface-900 text-lg">
                      {vendor.name}
                    </h3>
                    <p className="text-surface-500 text-sm">{vendor.type}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm font-medium text-surface-700">
                      <StarIcon size={14} className="text-warm-500 fill-warm-500"/>
                      {vendor.rating}
                    </div>
                  </div>
                </div>
              </div>))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-surface-900 text-surface-400 py-12 border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-brand-500 p-1.5 rounded-lg text-white">
                  <UtensilsIcon size={18}/>
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  SLIIT<span className="text-brand-500">Eats</span>
                </span>
              </Link>
              <p className="max-w-xs mb-6">
                Making university dining simpler, faster, and more enjoyable for
                everyone.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/canteens" className="hover:text-brand-400 transition-colors">
                    Canteens
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-brand-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="hover:text-brand-400 transition-colors">
                    Offers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-brand-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-brand-400 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-surface-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 SLIIT Eats University System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>);
}
