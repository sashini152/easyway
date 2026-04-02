async function testImageFix() {
    console.log('🧪 Testing image URL fix...');
    
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
        
        // Test creating article with fixed image URL
        console.log('📝 Creating article with fixed image URL...');
        const articleData = {
            title: 'Test Article with Fixed Image',
            content: 'This is a test article to verify that the image URL validation is working properly with the corrected URL format.',
            category: 'News',
            status: 'published',
            image: 'https://images.unsplash.com/photo-1555939594-58d6cb2a4003.jpg'
        };
        
        console.log('📋 Sending data:', JSON.stringify(articleData, null, 2));
        
        const createResponse = await fetch('http://localhost:5000/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(articleData)
        });
        
        console.log('📊 Response status:', createResponse.status);
        
        const data = await createResponse.json();
        console.log('📋 Response:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('✅ Article created successfully with fixed image URL!');
        } else {
            console.log('❌ Article creation failed:', data.message);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

testImageFix();
