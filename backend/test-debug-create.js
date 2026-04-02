async function testCreateCanteen() {
    console.log('🧪 Testing canteen creation with debug info...');
    
    const canteenData = {
        name: 'Debug Test Canteen',
        location: '123 Debug Street, Colombo',
        address: {
            street: '123 Debug Street',
            city: 'Colombo'
        },
        description: 'A debug test canteen',
        image: 'https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        status: 'active',
        operatingHours: {
            open: '08:00',
            close: '20:00'
        },
        contact: {
            phone: '+94 11 234 5678',
            email: 'debug@test.com'
        }
    };
    
    try {
        // Login first
        console.log('🔑 Getting admin token...');
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
        
        const loginData = await loginResponse.json();
        
        if (!loginData.success) {
            console.error('❌ Login failed:', loginData.message);
            return;
        }
        
        const token = loginData.data.token;
        console.log('✅ Login successful!');
        
        // Create canteen with detailed error handling
        console.log('📝 Creating canteen...');
        console.log('📋 Sending data:', JSON.stringify(canteenData, null, 2));
        
        const response = await fetch('http://localhost:5000/api/canteens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(canteenData)
        });
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers));
        
        const responseText = await response.text();
        console.log('📋 Raw response:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Failed to parse response as JSON:', e.message);
            console.log('📋 Raw response text:', responseText);
            return;
        }
        
        console.log('📋 Parsed response data:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('✅ Canteen created successfully!');
        } else {
            console.log('❌ Canteen creation failed:', data.message);
            if (data.error) {
                console.log('💥 Server error:', data.error);
            }
        }
        
    } catch (error) {
        console.error('💥 Network error:', error.message);
        console.error('💥 Stack trace:', error.stack);
    }
}

testCreateCanteen();
