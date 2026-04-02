async function debugArticleCreate() {
    console.log('🔍 Debugging article creation...');
    
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
        
        // Test creating article with minimal data
        console.log('📝 Creating test article with minimal data...');
        const articleData = {
            title: 'Test Article for Debug',
            content: 'This is a test article content that meets the minimum 50 character requirement for debugging purposes.',
            category: 'News',
            status: 'published'
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
        console.log('📊 Response headers:', Object.fromEntries(createResponse.headers));
        
        const responseText = await createResponse.text();
        console.log('📋 Raw response:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('❌ Failed to parse response as JSON:', e.message);
            console.log('📋 Raw response text:', responseText);
            return;
        }
        
        console.log('📋 Parsed response:', JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('💥 Network error:', error.message);
        console.error('💥 Stack trace:', error.stack);
    }
}

debugArticleCreate();
