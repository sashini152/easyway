async function testCreateCanteen() {
    console.log('🧪 Testing canteen creation with proper address format...');
    
    const canteenData = {
        name: 'Test Canteen',
        location: '123 Test Street, Colombo', // For backward compatibility
        address: {
            street: '123 Test Street',
            city: 'Colombo'
        },
        description: 'A test canteen for API validation',
        image: 'https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE',
        status: 'active',
        operatingHours: {
            open: '08:00',
            close: '20:00'
        },
        contact: {
            phone: '+94 11 234 5678',
            email: 'test@canteen.com'
        }
    };
    
    try {
        // First login to get token
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
        
        // Now create canteen
        console.log('📝 Creating canteen...');
        const response = await fetch('http://localhost:5000/api/canteens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(canteenData)
        });
        
        const data = await response.json();
        
        console.log('📊 Response status:', response.status);
        console.log('📋 Response data:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('✅ Canteen created successfully!');
            console.log('🏪 Canteen ID:', data.data.canteen._id);
            console.log('📍 Address:', data.data.canteen.address);
        } else {
            console.log('❌ Canteen creation failed:', data.message);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

testCreateCanteen();
