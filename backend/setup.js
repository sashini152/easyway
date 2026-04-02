const mongoose = require('mongoose');
require('dotenv').config();

// Sample data to populate the database
const sampleCanteens = [
    {
        name: "Main Canteen",
        type: 'Local Cuisine',
        rating: 4.8,
        status: 'open',
        image: 'https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'Main Building, SLIIT',
        description: 'The main canteen serving a variety of Sri Lankan and international cuisine',
        menuItems: 45,
        avgPrice: '₦350',
        operatingHours: '8:00 AM - 8:00 PM',
        manager: 'John Smith',
        contact: '+94 11 234 5678',
        location: {
            type: 'Main Building',
            coordinates: [79.8603, 6.9271]
        },
        facilities: ['WiFi', 'Air Conditioning', 'Seating Area', 'Parking', 'Wheelchair Accessible'],
        socialMedia: {
            website: 'https://sliit.lk',
            facebook: 'https://facebook.com/sliit',
            instagram: 'https://instagram.com/sliit'
        }
    },
    {
        name: 'Engineering Canteen',
        type: 'Fast Food',
        rating: 4.5,
        status: 'open',
        image: 'https://images.unsplash.com/photo-1512058769392-2d1d4a3d09?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        address: 'Engineering Faculty, SLIIT',
        description: 'Specializing in quick meals for engineering students',
        menuItems: 32,
        avgPrice: '₦280',
        operatingHours: '8:00 AM - 6:00 PM',
        manager: 'Sarah Johnson',
        contact: '+94 11 234 5679',
        location: {
            type: 'Engineering Faculty',
            coordinates: [79.8603, 6.9271]
        },
        facilities: ['WiFi', 'Air Conditioning', 'Seating Area'],
        socialMedia: {
            website: 'https://sliit.lk'
        }
    }
];

const sampleNews = [
    {
        title: "New Menu Items at Main Canteen",
        excerpt: "Exciting new dishes added to our main canteen menu this semester including traditional Sri Lankan cuisine and international favorites...",
        content: "Full content of the article goes here with detailed information about the new menu items, including descriptions, prices, and availability. The new additions include popular student favorites like kottu, string hoppers, and various vegetarian options that have been requested by students.",
        author: "Admin",
        category: "News",
        image: "https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
        views: 1234,
        comments: [],
        likes: [],
        status: "published",
        featured: true,
        tags: ["menu", "new items", "canteen", "food"],
        publishedAt: new Date(),
        createdAt: new Date(),
        seo: {
            metaTitle: "New Menu Items at Main Canteen - SLIIT Eats",
            metaDescription: "Discover the exciting new dishes added to the main canteen menu this semester at SLIIT.",
            keywords: ["SLIIT", "canteen", "menu", "food", "new items"]
        }
    },
    {
        title: "Healthy Eating Tips for Students",
        excerpt: "Discover how to maintain a balanced diet while studying and managing your busy schedule...",
        content: "Full content of the article goes here with detailed health tips and nutritional advice for students. This includes meal planning, healthy snack options, and tips for maintaining energy levels throughout the day.",
        author: "Nutrition Team",
        category: "Health",
        image: "https://images.unsplash.com/photo-1512621776957-07ab9f43873?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
        views: 892,
        comments: [],
        likes: [],
        status: "published",
        featured: false,
        tags: ["health", "nutrition", "students", "diet"],
        publishedAt: new Date(),
        createdAt: new Date(),
        seo: {
            metaTitle: "Healthy Eating Tips for Students - SLIIT Eats",
            metaDescription: "Essential nutrition advice for SLIIT students to maintain a healthy lifestyle.",
            keywords: ["health", "nutrition", "students", "diet", "SLIIT"]
        }
    }
];

const sampleOffers = [
    {
        title: "Student Special - 20% Off",
        description: "Get 20% off on all meals with valid student ID",
        discount: "20%",
        shopName: "Main Canteen",
        validUntil: "2024-12-31",
        category: "student",
        status: "active",
        usageLimit: "Unlimited",
        minOrder: "₦100",
        maxDiscount: "₦500",
        applicableItems: ["All meals", "Beverages", "Snacks"],
        exclusions: ["Alcohol", "Tobacco"],
        color: "from-blue-500 to-purple-500",
        terms: "Valid with student ID only",
        priority: 5,
        redemptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        clickCount: 0,
        conversionRate: 0,
        revenue: 0
    },
    {
        title: "Combo Meal Deal",
        description: "Rice + Curry + Drink for only Rs. 350",
        discount: "Rs. 350",
        shopName: "Engineering Canteen",
        validUntil: "2024-11-30",
        category: "combo",
        status: "active",
        usageLimit: "Once per day",
        minOrder: "₦300",
        maxDiscount: "Rs. 350",
        applicableItems: ["Rice", "Curry", "Drink"],
        exclusions: ["Extra portions"],
        color: "from-orange-500 to-red-500",
        terms: "Valid for one combo meal per day",
        priority: 4,
        redemptions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        clickCount: 0,
        conversionRate: 0,
        revenue: 0
    }
];

async function setupDatabase() {
    try {
        console.log('🔄 Clearing existing data...');
        
        // Clear existing data
        await mongoose.connection.db.dropDatabase();
        console.log('✅ Database cleared');
        
        console.log('📊 Inserting sample canteens...');
        const Canteen = require('./models/Canteen');
        await Canteen.insertMany(sampleCanteens);
        console.log(`✅ Inserted ${sampleCanteens.length} canteens`);
        
        console.log('📝 Inserting sample news...');
        const News = require('./models/News');
        await News.insertMany(sampleNews);
        console.log(`✅ Inserted ${sampleNews.length} news articles`);
        
        console.log('🎁 Inserting sample offers...');
        const Offer = require('./models/Offer');
        await Offer.insertMany(sampleOffers);
        console.log(`✅ Inserted ${sampleOffers.length} offers`);
        
        console.log('🎉 Database setup complete!');
        console.log('\n📊 Sample Data Summary:');
        console.log(`   Canteens: ${sampleCanteens.length}`);
        console.log(`   News Articles: ${sampleNews.length}`);
        console.log(`   Offers: ${sampleOffers.length}`);
        console.log('\n🚀 You can now start the backend server with: npm run dev');
        console.log('🌐 Frontend will connect to: http://localhost:5000/api/*');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

// Check if database is empty
async function checkDatabase() {
    try {
        const Canteen = require('./models/Canteen');
        const canteenCount = await Canteen.countDocuments();
        const News = require('./models/News');
        const newsCount = await News.countDocuments();
        const Offer = require('./models/Offer');
        const offerCount = await Offer.countDocuments();
        
        console.log('\n📊 Current Database Status:');
        console.log(`   Canteens: ${canteenCount}`);
        console.log(`   News Articles: ${newsCount}`);
        console.log(`   Offers: ${offerCount}`);
        
        if (canteenCount === 0 && newsCount === 0 && offerCount === 0) {
            console.log('\n🆕 Database is empty. Run: node setup.js to populate with sample data');
        } else {
            console.log('\n✅ Database contains data. Ready to go!');
        }
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking database:', error);
        process.exit(1);
    }
}

// Command line arguments
const command = process.argv[2];

if (command === 'setup') {
    setupDatabase();
} else if (command === 'check') {
    checkDatabase();
} else {
    console.log('Usage:');
    console.log('  node setup.js    - Populate database with sample data');
    console.log('  node check.js    - Check database status');
    console.log('\nExample:');
    console.log('  npm run setup    - Will run setup.js');
    console.log('  npm run check    - Will run check.js');
}
