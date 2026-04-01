export const shops = [
  {
    id: "1",
    name: "Main Canteen",
    description: "The main canteen serving a variety of Sri Lankan and international cuisine",
    image: "https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    rating: 4.5,
    address: "Main Building, SLIIT",
    status: "open",
    shopName: "Main Canteen"
  },
  {
    id: "2",
    name: "Engineering Canteen",
    description: "Specializing in quick meals for engineering students",
    image: "https://images.unsplash.com/photo-1512058764286-8bb0250b91d5?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    rating: 4.3,
    address: "Engineering Faculty, SLIIT",
    status: "open",
    shopName: "Engineering Canteen"
  },
  {
    id: "3",
    name: "Business School Canteen",
    description: "Modern canteen with healthy and international options",
    image: "https://images.unsplash.com/photo-1555939594-58d6cb832d44?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    rating: 4.7,
    address: "Business Faculty, SLIIT",
    status: "open",
    shopName: "Business School Canteen"
  }
];

export const foodItems = [
  {
    id: "1",
    name: "Rice and Curry",
    description: "Traditional Sri Lankan rice with curry and vegetables",
    price: 350,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopId: "1"
  },
  {
    id: "2",
    name: "Chicken Submarine",
    description: "Grilled chicken submarine with vegetables",
    price: 280,
    category: "Sandwich",
    image: "https://images.unsplash.com/photo-1568901342478-489efb5335c2?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopId: "1"
  },
  {
    id: "3",
    name: "Mixed Rice",
    description: "Mixed rice with vegetables and egg",
    price: 220,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1512058764286-8bb0250b91d5?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopId: "2"
  },
  {
    id: "4",
    name: "Samosa",
    description: "Crispy samosa with potato filling",
    price: 80,
    category: "Snack",
    image: "https://images.unsplash.com/photo-1586200852026-3122b2eb83cf?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopId: "2"
  },
  {
    id: "5",
    name: "Vegetable Rice",
    description: "Healthy vegetable rice with mixed vegetables",
    price: 180,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1512058764286-8bb0250b91d5?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopId: "3"
  },
  {
    id: "6",
    name: "Pasta",
    description: "Italian pasta with tomato sauce",
    price: 320,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopId: "3"
  }
];

export const blogPosts = [
  {
    id: "1",
    title: "New Canteen Opening at Engineering Faculty",
    excerpt: "We're excited to announce the opening of our new canteen at the Engineering Faculty...",
    content: "We're excited to announce the opening of our new canteen at the Engineering Faculty. This new facility will serve a variety of quick meals and snacks perfect for engineering students who need energy for their studies. The canteen features modern seating arrangements and a comfortable environment for studying and dining.",
    author: "Admin",
    createdAt: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopName: "Engineering Canteen",
    category: "News"
  },
  {
    id: "2",
    title: "Special Menu Items for Finals Week",
    excerpt: "Check out our special study menu items designed to help you power through your exams...",
    content: "Check out our special study menu items designed to help you power through your exams. We've added brain-boosting foods like nuts, fruits, and protein-rich meals to our menu. These items are available at all canteens during the finals week at special prices.",
    author: "Canteen Manager",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    image: "https://images.unsplash.com/photo-1512058764286-8bb0250b91d5?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopName: "Main Canteen",
    category: "Update"
  },
  {
    id: "3",
    title: "Holiday Schedule Update",
    excerpt: "Please note the updated holiday hours for all canteens during the upcoming holiday period...",
    content: "Please note the updated holiday hours for all canteens during the upcoming holiday period. Main Canteen will be open with limited hours, while Engineering and Business School canteens will be closed. We apologize for any inconvenience and wish everyone a happy holiday!",
    author: "Admin",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnW0hc8hhE",
    shopName: "Main Canteen",
    category: "Update"
  }
];

export const comments = [
  {
    id: "1",
    text: "Great article! Very informative about the new canteen openings.",
    author: "Student A",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 12,
    articleId: "1"
  },
  {
    id: "2", 
    text: "The food quality has really improved this semester. Keep up the good work!",
    author: "Student B",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    likes: 8,
    articleId: "2"
  }
];

export const offers = [
  {
    id: "1",
    title: "Student Special - 20% Off",
    description: "Get 20% off on all meals with valid student ID",
    discount: "20%",
    shopName: "Main Canteen",
    validUntil: "2024-12-31",
    category: "student"
  },
  {
    id: "2",
    title: "Combo Meal Deal",
    description: "Rice + Curry + Drink for only Rs. 350",
    discount: "Rs. 350",
    shopName: "Engineering Canteen",
    validUntil: "2024-11-30",
    category: "combo"
  }
];

export const users = [
  { id: 1, name: "Super Admin", email: "admin@sliit.lk", password: "ADMIN123456", role: "super_admin" },
  { id: 2, name: "Student", email: "student@sliit.lk", password: "STD123456", role: "student" },
  { id: 3, name: "Shop Admin", email: "pscanteen@sliit.lk", password: "PNS123456", role: "shop_admin" },
  { id: 4, name: "Canteen Admin", email: "canteen.admin@sliit.lk", password: "ADMIN123", role: "canteen_admin" },
  { id: 5, name: "Canteen Owner", email: "canteen.owner@sliit.lk", password: "OWNER123", role: "canteen_owner" }
];
