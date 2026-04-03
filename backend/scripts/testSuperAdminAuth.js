const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function testSuperAdminAuth() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find super admin
        const superAdmin = await User.findOne({ role: 'super_admin' });
        
        if (!superAdmin) {
            console.log('No super admin found');
            return;
        }

        console.log('Super Admin found:');
        console.log('Name:', superAdmin.name);
        console.log('Email:', superAdmin.email);
        console.log('Role:', superAdmin.role);
        console.log('Active:', superAdmin.isActive);
        console.log('ID:', superAdmin._id);

        // Check if there are any other super admins
        const allSuperAdmins = await User.find({ role: 'super_admin' });
        console.log('\nTotal Super Admins:', allSuperAdmins.length);

        // Check all users and their roles
        const allUsers = await User.find({});
        console.log('\nAll Users:');
        allUsers.forEach((user, i) => {
            console.log(i+1 + '. ' + user.name + ' (' + user.email + ') - Role: ' + user.role + ' - Active: ' + user.isActive);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}

testSuperAdminAuth();
