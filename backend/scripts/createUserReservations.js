const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Canteen = require('../models/Canteen');
const User = require('../models/User');
require('dotenv').config();

async function createUserReservations() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get users and canteens
        const users = await User.find({ role: 'user' });
        const canteens = await Canteen.find({});

        console.log(`Found ${users.length} users and ${canteens.length} canteens`);

        // Clear existing reservations
        await Reservation.deleteMany({});
        console.log('Cleared existing reservations');

        // Create reservations for each user
        const userReservations = [
            {
                customer: {
                    name: 'Alice Johnson',
                    email: 'alice@user.com',
                    phone: '+1234567890'
                },
                canteen: canteens[0]?._id,
                date: new Date('2026-04-05'),
                time: '12:00',
                partySize: 2,
                specialRequests: 'Window seat preferred',
                status: 'pending'
            },
            {
                customer: {
                    name: 'Bob Wilson',
                    email: 'bob@user.com',
                    phone: '+0987654321'
                },
                canteen: canteens[0]?._id,
                date: new Date('2026-04-05'),
                time: '13:30',
                partySize: 4,
                specialRequests: 'Vegetarian options needed',
                status: 'confirmed'
            },
            {
                customer: {
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '+1122334455'
                },
                canteen: canteens[1]?._id,
                date: new Date('2026-04-06'),
                time: '19:00',
                partySize: 3,
                specialRequests: 'Birthday celebration',
                status: 'confirmed'
            },
            {
                customer: {
                    name: 'Alice Johnson',
                    email: 'alice@user.com',
                    phone: '+1234567890'
                },
                canteen: canteens[1]?._id,
                date: new Date('2026-04-06'),
                time: '18:30',
                partySize: 2,
                specialRequests: 'Anniversary dinner',
                status: 'pending'
            }
        ];

        const createdReservations = await Reservation.insertMany(userReservations);
        console.log(`Created ${createdReservations.length} user reservations:`);

        createdReservations.forEach((res, index) => {
            console.log(`${index + 1}. ${res.customer.name} (${res.customer.email}) - ${res.date.toLocaleDateString()} ${res.time} - ${res.status}`);
        });

        console.log('\nUser reservations created successfully!');
        console.log('Users can now log in and see their own reservations.');

    } catch (error) {
        console.error('Error creating user reservations:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Run the function
createUserReservations();
