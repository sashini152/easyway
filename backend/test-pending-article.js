async function testPendingArticle() {
    console.log('🧪 Testing pending article visibility...');
    
    try {
        // Login as Super Admin
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
        
        // Create a pending article
        console.log('📝 Creating pending article...');
        const articleData = {
            title: 'Test Pending Article',
            content: 'This is a test article with pending status to check if Super Admin can see it.',
            category: 'Food Review',
            status: 'pending'
        };
        
        const createResponse = await fetch('http://localhost:5000/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(articleData)
        });
        
        const createData = await createResponse.json();
        
        if (createData.success) {
            console.log('✅ Pending article created!');
            console.log('🆔 Article ID:', createData.data._id);
            console.log('📊 Status:', createData.data.status);
            
            // Now test fetching articles as Super Admin
            console.log('📚 Fetching articles as Super Admin...');
            const getResponse = await fetch('http://localhost:5000/api/articles', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const getData = await getResponse.json();
            
            if (getData.success) {
                console.log(`✅ Found ${getData.data.articles.length} total articles`);
                
                // Count by status
                const published = getData.data.articles.filter(a => a.status === 'published').length;
                const pending = getData.data.articles.filter(a => a.status === 'pending').length;
                const draft = getData.data.articles.filter(a => a.status === 'draft').length;
                
                console.log(`📊 Status breakdown:`);
                console.log(`   Published: ${published}`);
                console.log(`   Pending: ${pending}`);
                console.log(`   Draft: ${draft}`);
                
                // Check if our new article is visible
                const newArticle = getData.data.articles.find(a => a._id === createData.data._id);
                if (newArticle) {
                    console.log('✅ New pending article is visible to Super Admin!');
                } else {
                    console.log('❌ New pending article is NOT visible to Super Admin!');
                }
            }
        } else {
            console.log('❌ Article creation failed:', createData.message);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

testPendingArticle();
