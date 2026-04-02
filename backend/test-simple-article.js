async function testSimpleArticle() {
    console.log('🧪 Testing simple article creation...');
    
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
        console.log('📝 Creating simple article...');
        const articleData = {
            title: 'Simple Test Article',
            content: 'This is a simple test article that meets the minimum 50 character requirement for testing purposes.',
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
        
        const data = await createResponse.json();
        console.log('📋 Response:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('✅ Article created successfully!');
            console.log('🆔 Article ID:', data.data._id);
            
            // Now test fetching articles
            console.log('📚 Fetching articles...');
            const getResponse = await fetch('http://localhost:5000/api/articles');
            const getData = await getResponse.json();
            
            if (getData.success) {
                console.log(`✅ Found ${getData.data.articles.length} articles`);
                const newArticle = getData.data.articles.find(a => a._id === data.data._id);
                if (newArticle) {
                    console.log('✅ New article found in list!');
                    console.log('📝 Title:', newArticle.title);
                    console.log('📊 Status:', newArticle.status);
                } else {
                    console.log('❌ New article not found in list');
                }
            }
        } else {
            console.log('❌ Article creation failed:', data.message);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

testSimpleArticle();
