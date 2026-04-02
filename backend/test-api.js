const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Test API endpoints
const testAPI = async () => {
    try {
        // Test health endpoint
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);

        // Test login endpoint
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@easyway.com',
                password: 'admin123'
            })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('✅ Login successful:', loginData.success);
            console.log('📋 User role:', loginData.data.user.role);
            console.log('🔑 Token received:', loginData.data.token ? 'Yes' : 'No');
        } else {
            const errorData = await loginResponse.json();
            console.log('❌ Login failed:', errorData.message);
        }

        // Test canteens endpoint
        const canteensResponse = await fetch('http://localhost:5000/api/canteens');
        const canteensData = await canteensResponse.json();
        console.log('✅ Canteens endpoint:', canteensData.success);
        console.log('📊 Number of canteens:', canteensData.data.canteens.length);

    } catch (error) {
        console.error('❌ API test failed:', error.message);
    }
};

testAPI();
