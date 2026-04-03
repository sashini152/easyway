const mongoose = require('mongoose');
const User = require('./models/User');
const Canteen = require('./models/Canteen');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/easyway')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function assignCanteenToShopOwner() {
    try {
        // Find the shop owner
        const shopOwner = await User.findOne({ email: 'john@shopowner.com' });
        if (!shopOwner) {
            console.log('Shop owner not found');
            return;
        }
        console.log('Found shop owner:', shopOwner.name);

        // Find a canteen to assign
        const canteen = await Canteen.findOne();
        if (!canteen) {
            console.log('No canteen found. Creating a test canteen...');
            
            // Create a test canteen
            const newCanteen = new Canteen({
                name: 'Test Canteen',
                location: 'Main Building',
                description: 'Test canteen for menu management',
                image: 'https://example.com/canteen.jpg',
                status: 'active',
                operatingHours: {
                    open: '08:00',
                    close: '20:00'
                },
                contact: {
                    phone: '123-456-7890',
                    email: 'test@canteen.com'
                },
                address: {
                    street: '123 Main St',
                    city: 'Test City',
                    postalCode: '12345'
                },
                facilities: ['WiFi', 'AC', 'Parking']
            });

            const savedCanteen = await newCanteen.save();
            console.log('Created new canteen:', savedCanteen.name);
            
            // Assign the new canteen to shop owner
            shopOwner.assignedCanteen = savedCanteen._id;
            await shopOwner.save();
            console.log('Assigned canteen to shop owner');
        } else {
            console.log('Found canteen:', canteen.name);
            
            // Assign existing canteen to shop owner
            shopOwner.assignedCanteen = canteen._id;
            await shopOwner.save();
            console.log('Assigned canteen to shop owner');
        }

        console.log('✅ Shop owner now has an assigned canteen!');
        console.log('Shop Owner:', shopOwner.name);
        console.log('Assigned Canteen:', shopOwner.assignedCanteen);

    } catch (error) {
        console.error('Error assigning canteen:', error);
    } finally {
        mongoose.connection.close();
    }
}

assignCanteenToShopOwner();
