const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Present' : 'Missing');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Canteen = require('../models/Canteen');
const Article = require('../models/Article');

// Sample data
const sampleUsers = [
    {
        name: 'Super Admin',
        email: 'admin@easyway.com',
        password: 'admin123',
        role: 'super_admin',
        phone: '+94 11 234 5678',
        isActive: true
    },
    {
        name: 'John Smith',
        email: 'john@shopowner.com',
        password: 'owner123',
        role: 'shop_owner',
        phone: '+94 11 234 5679',
        isActive: true
    },
    {
        name: 'Jane Doe',
        email: 'jane@shopowner.com',
        password: 'owner123',
        role: 'shop_owner',
        phone: '+94 11 234 5680',
        isActive: true
    },
    {
        name: 'Alice Johnson',
        email: 'alice@user.com',
        password: 'user123',
        role: 'user',
        phone: '+94 11 234 5681',
        isActive: true
    },
    {
        name: 'Bob Wilson',
        email: 'bob@user.com',
        password: 'user123',
        role: 'user',
        phone: '+94 11 234 5682',
        isActive: true
    }
];

const sampleCanteens = [
    {
        name: 'Main Canteen',
        location: 'Main Building, SLIIT',
        description: 'The main canteen serving a variety of Sri Lankan and international cuisine with comfortable seating and modern facilities.',
        image: 'https://picsum.photos/seed/canteen1/800/600.jpg',
        status: 'active',
        operatingHours: {
            open: '08:00',
            close: '20:00'
        },
        contact: {
            phone: '+94 11 234 5678',
            email: 'maincanteen@sliit.lk'
        },
        address: {
            street: 'SLIIT Main Building',
            city: 'Colombo',
            postalCode: '10115'
        },
        facilities: ['WiFi', 'Air Conditioning', 'Seating Area', 'Parking', 'Wheelchair Accessible', 'Delivery', 'Takeaway'],
        menu: [
            {
                name: 'Rice and Curry',
                price: 350,
                category: 'Lunch',
                description: 'Traditional Sri Lankan rice and curry with vegetables',
                isAvailable: true
            },
            {
                name: 'Kottu',
                price: 450,
                category: 'Dinner',
                description: 'Sri Lankan kottu roti with vegetables and egg',
                isAvailable: true
            },
            {
                name: 'Sandwich',
                price: 200,
                category: 'Snacks',
                description: 'Fresh vegetable sandwich',
                isAvailable: true
            }
        ]
    },
    {
        name: 'Engineering Canteen',
        location: 'Engineering Faculty, SLIIT',
        description: 'Specializing in quick meals and snacks for engineering students with convenient location and affordable prices.',
        image: 'https://picsum.photos/seed/engineering/800/600.jpg',
        status: 'active',
        operatingHours: {
            open: '08:00',
            close: '18:00'
        },
        contact: {
            phone: '+94 11 234 5679',
            email: 'engcanteen@sliit.lk'
        },
        address: {
            street: 'SLIIT Engineering Faculty',
            city: 'Colombo',
            postalCode: '10115'
        },
        facilities: ['WiFi', 'Air Conditioning', 'Seating Area'],
        menu: [
            {
                name: 'Short Eats',
                price: 150,
                category: 'Snacks',
                description: 'Assorted Sri Lankan short eats',
                isAvailable: true
            },
            {
                name: 'Noodles',
                price: 280,
                category: 'Lunch',
                description: 'Fried noodles with vegetables',
                isAvailable: true
            }
        ]
    },
    {
        name: 'Business School Canteen',
        location: 'Business Faculty, SLIIT',
        description: 'Modern canteen with international cuisine options, perfect for business students and faculty members.',
        image: 'https://picsum.photos/seed/business/800/600.jpg',
        status: 'active',
        operatingHours: {
            open: '09:00',
            close: '19:00'
        },
        contact: {
            phone: '+94 11 234 5680',
            email: 'businesscanteen@sliit.lk'
        },
        address: {
            street: 'SLIIT Business Faculty',
            city: 'Colombo',
            postalCode: '10115'
        },
        facilities: ['WiFi', 'Air Conditioning', 'Seating Area', 'Parking'],
        menu: [
            {
                name: 'Pasta',
                price: 400,
                category: 'Lunch',
                description: 'Italian pasta with tomato sauce',
                isAvailable: true
            },
            {
                name: 'Salad',
                price: 250,
                category: 'Lunch',
                description: 'Fresh garden salad',
                isAvailable: true
            }
        ]
    }
];

const sampleArticles = [
    {
        title: 'Best Food Options at SLIIT Main Canteen',
        content: 'The SLIIT Main Canteen offers a wide variety of delicious food options that cater to different tastes and dietary preferences. From traditional Sri Lankan cuisine to international dishes, there\'s something for everyone. The rice and curry is particularly popular among students, offering authentic flavors at affordable prices. The canteen also provides vegetarian options and has a clean, comfortable environment for dining.',
        excerpt: 'Discover the best food options available at SLIIT Main Canteen',
        category: 'Food Review',
        tags: ['SLIIT', 'Main Canteen', 'Food Review', 'Campus Life'],
        status: 'published',
        featured: true,
        seo: {
            metaTitle: 'Best Food at SLIIT Main Canteen',
            metaDescription: 'A comprehensive review of food options at SLIIT Main Canteen',
            keywords: ['SLIIT', 'canteen', 'food', 'review']
        }
    },
    {
        title: 'Healthy Eating Tips for University Students',
        content: 'As university students, maintaining a healthy diet can be challenging with busy schedules and limited budgets. However, the SLIIT canteens offer several healthy options that can help you stay energized and focused. Opt for balanced meals that include proteins, carbohydrates, and vegetables. Avoid excessive fast food and sugary drinks. Stay hydrated and try to eat at regular times to maintain your energy levels throughout the day.',
        excerpt: 'Practical tips for maintaining a healthy diet while studying at university',
        category: 'Health Tips',
        tags: ['Health', 'Students', 'Diet', 'Tips'],
        status: 'published',
        featured: false,
        seo: {
            metaTitle: 'Healthy Eating Tips for Students',
            metaDescription: 'Essential nutrition advice for university students',
            keywords: ['health', 'students', 'nutrition', 'diet']
        }
    },
    {
        title: 'Upcoming Food Festival at SLIIT',
        content: 'Get ready for the most anticipated food festival of the year! SLIIT is hosting a grand food festival next month featuring cuisines from around the world. Students can expect food stalls, cooking demonstrations, and special discounts from various vendors. This is a great opportunity to try new dishes and celebrate the diverse culinary culture within our campus community.',
        excerpt: 'Join us for an exciting food festival celebrating diverse cuisines',
        category: 'Events',
        tags: ['Events', 'Food Festival', 'SLIIT', 'Campus'],
        status: 'published',
        featured: true,
        seo: {
            metaTitle: 'SLIIT Food Festival 2024',
            metaDescription: 'Join the annual food festival at SLIIT with diverse cuisines',
            keywords: ['food festival', 'SLIIT', 'events', 'cuisine']
        }
    }
];

// Connect to database and seed data
const seedDatabase = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('✅ Connected to MongoDB');
        
        // Clear existing data
        console.log('🔄 Clearing existing data...');
        await User.deleteMany({});
        await Canteen.deleteMany({});
        await Article.deleteMany({});
        console.log('✅ Cleared existing data');
        
        // Create users
        console.log('🔄 Creating users...');
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        console.log(`✅ Created ${createdUsers.length} users`);
        
        // Create canteens and assign shop owners
        console.log('🔄 Creating canteens...');
        const createdCanteens = [];
        for (let i = 0; i < sampleCanteens.length; i++) {
            const canteenData = {
                ...sampleCanteens[i],
                assignedShopOwner: createdUsers[i + 1]._id, // Skip super admin
                createdBy: createdUsers[0]._id // Super admin
            };
            
            const canteen = new Canteen(canteenData);
            await canteen.save();
            createdCanteens.push(canteen);
            
            // Update shop owner with assigned canteen
            await User.findByIdAndUpdate(createdUsers[i + 1]._id, {
                assignedCanteen: canteen._id
            });
        }
        console.log(`✅ Created ${createdCanteens.length} canteens`);
        
        // Create articles
        console.log('🔄 Creating articles...');
        const createdArticles = [];
        for (let i = 0; i < sampleArticles.length; i++) {
            const articleData = {
                ...sampleArticles[i],
                author: createdUsers[i + 2]._id // Use regular users as authors
            };
            
            const article = new Article(articleData);
            await article.save();
            createdArticles.push(article);
        }
        console.log(`✅ Created ${createdArticles.length} articles`);
        
        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   Users: ${createdUsers.length}`);
        console.log(`   Canteens: ${createdCanteens.length}`);
        console.log(`   Articles: ${createdArticles.length}`);
        
        console.log('\n👤 Login Credentials:');
        console.log('   Super Admin: admin@easyway.com / admin123');
        console.log('   Shop Owner 1: john@shopowner.com / owner123');
        console.log('   Shop Owner 2: jane@shopowner.com / owner123');
        console.log('   User 1: alice@user.com / user123');
        console.log('   User 2: bob@user.com / user123');
        
        console.log('\n🚀 You can now start the application!');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
};

// Run the seeding function
seedDatabase();
