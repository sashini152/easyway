const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Test login with different formats
const testLoginFormats = async () => {
    const testCases = [
        { email: 'admin@easyway.com', password: 'admin123' },
        { email: '"admin@easyway.com"', password: 'admin123' },
        { email: 'admin@easyway.com"', password: 'admin123' },
        { email: '"admin@easyway.com"', password: '"admin123"' }
    ];

    for (const testCase of testCases) {
        try {
            console.log(`\n🔄 Testing with:`, testCase);
            
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testCase)
            });

            const data = await response.json();
            
            console.log(`📊 Status: ${response.status}`);
            console.log(`📋 Response:`, data);
            
        } catch (error) {
            console.error(`❌ Error:`, error.message);
        }
    }
};

testLoginFormats();
