const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Test registration endpoint
const testRegister = async () => {
    try {
        console.log('🔄 Testing registration endpoint...');
        
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                password: 'test123',
                role: 'user',
                phone: '+94 11 234 5678'
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Registration successful:', data.success);
            console.log('📋 User created:', data.data.user.name);
            console.log('📧 Email:', data.data.user.email);
            console.log('🔑 Token received:', data.data.token ? 'Yes' : 'No');
        } else {
            console.log('❌ Registration failed:', data.message);
        }

    } catch (error) {
        console.error('❌ Registration test failed:', error.message);
        console.log('💡 Make sure the backend server is running on http://localhost:5000');
    }
};

testRegister();
