const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
require('dotenv').config();

async function dropConfirmationCodeIndex() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get the collection
        const collection = mongoose.connection.db.collection('reservations');
        
        // Drop the confirmationCode index
        try {
            await collection.dropIndex('confirmationCode_1');
            console.log('Dropped confirmationCode_1 index');
        } catch (error) {
            if (error.codeName === 'IndexNotFound') {
                console.log('confirmationCode_1 index not found, continuing...');
            } else {
                throw error;
            }
        }

        // List all indexes to verify
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(idx => idx.name));

    } catch (error) {
        console.error('Error dropping index:', error);
    } finally {
        await mongoose.disconnect();
    }
}

// Run the function
dropConfirmationCodeIndex();
