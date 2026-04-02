async function testArticles() {
    console.log('🧪 Testing article API...');
    
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
        
        // Test creating an article
        console.log('📝 Creating test article...');
        const articleData = {
            title: 'SLIIT Eats Digital Menu Launch',
            content: 'We are excited to announce the launch of our new digital menu system across all campus canteens. This new system will allow students to browse menus, place orders, and make payments directly through their mobile devices. The digital menu system features real-time availability updates, nutritional information, and personalized recommendations based on your preferences. Students can now pre-order their meals and skip the queue during peak hours.',
            excerpt: 'New digital menu system revolutionizes campus dining',
            category: 'News', // Must match the enum values
            tags: ['digital', 'menu', 'tech', 'campus'], // Array format, shorter tags
            // image: 'https://images.unsplash.com/photo-1555939594-58d6cb2a4003?ixlib=rb-4.0.3&ixid=MnW0hc8hhE', // Omit for now
            status: 'published'
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
        console.log('📊 Create response:', createData);
        
        if (createData.success) {
            console.log('✅ Article created successfully!');
        } else {
            console.log('❌ Article creation failed:', createData.message);
        }
        
        // Test getting all articles
        console.log('📚 Fetching all articles...');
        const getResponse = await fetch('http://localhost:5000/api/articles');
        const getData = await getResponse.json();
        
        if (getData.success) {
            console.log(`✅ Found ${getData.data.articles.length} articles:`);
            getData.data.articles.forEach((article, index) => {
                console.log(`${index + 1}. ${article.title} - ${article.category} - ${article.status}`);
            });
        } else {
            console.log('❌ Failed to fetch articles:', getData.message);
        }
        
    } catch (error) {
        console.error('💥 Error:', error.message);
    }
}

testArticles();
