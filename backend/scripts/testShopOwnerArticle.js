const mongoose = require('mongoose');
const Article = require('../models/Article');
const User = require('../models/User');
const Canteen = require('../models/Canteen');
require('dotenv').config();

async function testShopOwnerArticle() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a shop owner and their canteen
        const shopOwner = await User.findOne({ role: 'shop_owner' });
        const canteen = await Canteen.findOne({});

        if (!shopOwner) {
            console.log('No shop owner found');
            return;
        }

        if (!canteen) {
            console.log('No canteen found');
            return;
        }

        console.log('Shop Owner:', shopOwner.name, shopOwner.email);
        console.log('Canteen:', canteen.name);

        // Create a test article
        const testArticle = new Article({
            title: 'Test Article by Shop Owner',
            content: 'This is a test article created by a shop owner for their canteen. It should appear in their dashboard.',
            category: 'News',
            status: 'published',
            author: shopOwner._id,
            canteen: canteen._id,
            canteenName: canteen.name,
            publishedAt: new Date()
        });

        const savedArticle = await testArticle.save();
        console.log('Test article created:', savedArticle._id);
        console.log('Article title:', savedArticle.title);
        console.log('Canteen:', savedArticle.canteenName);

        // Test fetching articles for this canteen
        const canteenArticles = await Article.find({ canteen: canteen._id })
            .populate('author', 'name email')
            .populate('canteen', 'name');

        console.log('\nArticles for canteen:', canteen.name);
        console.log('Count:', canteenArticles.length);
        canteenArticles.forEach((article, i) => {
            console.log(i+1 + '. ' + article.title + ' by ' + article.author.name);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

testShopOwnerArticle();
