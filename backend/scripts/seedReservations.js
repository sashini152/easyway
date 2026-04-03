const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Canteen = require('../models/Canteen');
require('dotenv').config();

const sampleReservations = [
    {
        customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890'
        },
        date: new Date('2026-04-05'),
        time: '12:00',
        partySize: 4,
        specialRequests: 'Vegetarian options needed',
        status: 'confirmed'
    },
    {
        customer: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+0987654321'
        },
        date: new Date('2026-04-05'),
        time: '13:30',
        partySize: 2,
        specialRequests: 'Allergic to nuts',
        status: 'pending'
    },
    {
        customer: {
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+1122334455'
        },
        date: new Date('2026-04-06'),
        time: '19:00',
        partySize: 6,
        specialRequests: 'Birthday celebration - cake needed',
        status: 'confirmed'
    },
    {
        customer: {
            name: 'Sarah Williams',
            email: 'sarah.williams@example.com',
            phone: '+5544332211'
        },
        date: new Date('2026-04-06'),
        time: '18:30',
        partySize: 3,
        specialRequests: 'Window seat preferred',
        status: 'pending'
    },
    {
        customer: {
            name: 'David Brown',
            email: 'david.brown@example.com',
            phone: '+9988776655'
        },
        date: new Date('2026-04-04'),
        time: '20:00',
        partySize: 2,
        specialRequests: 'Anniversary dinner',
        status: 'completed'
    },
    {
        customer: {
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '+1234567890'
        },
        date: new Date('2026-04-04'),
        time: '14:00',
        partySize: 5,
        specialRequests: 'Kids menu needed',
        status: 'cancelled'
    }
];

async function seedReservations() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get the first canteen (or use a specific ID)
        const canteen = await Canteen.findOne();
        if (!canteen) {
            console.log('No canteen found. Please create a canteen first.');
            return;
        }

        console.log(`Using canteen: ${canteen.name} (${canteen._id})`);

        // Clear existing reservations
        await Reservation.deleteMany({});
        console.log('Cleared existing reservations');

        // Add sample reservations
        const reservations = sampleReservations.map(reservation => ({
            ...reservation,
            canteen: canteen._id
        }));

        const createdReservations = await Reservation.insertMany(reservations);
        console.log(`Created ${createdReservations.length} sample reservations:`);

        createdReservations.forEach((res, index) => {
            console.log(`${index + 1}. ${res.customer.name} - ${res.date.toLocaleDateString()} ${res.time} - ${res.status}`);
        });

        console.log('\nSample data seeded successfully!');
        console.log('You can now test the reservation system with this data.');

    } catch (error) {
        console.error('Error seeding reservations:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Run the seed function
seedReservations();
