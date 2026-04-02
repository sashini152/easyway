const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Test the specific login credentials
const testSpecificLogin = async () => {
    try {
        console.log('🔄 Testing admin login...');
        
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@easyway.com',
                password: 'admin123'
            })
        });

        const data = await response.json();
        
        console.log('📊 Response status:', response.status);
        console.log('📋 Response data:', JSON.stringify(data, null, 2));
        
        if (response.ok && data.success) {
            console.log('✅ Admin login successful!');
            console.log('👤 User:', data.data.user.name);
            console.log('📧 Email:', data.data.user.email);
            console.log('🔑 Role:', data.data.user.role);
            console.log('🎫 Token:', data.data.token.substring(0, 20) + '...');
        } else {
            console.log('❌ Admin login failed:', data.message);
        }

    } catch (error) {
        console.error('❌ Login test failed:', error.message);
    }
};

testSpecificLogin();
