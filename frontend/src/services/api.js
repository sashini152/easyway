const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('token');
};

// Get user from localStorage
const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Set user in localStorage
const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
const removeUser = () => {
    localStorage.removeItem('user');
};

// Make API request
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const user = getUser();

    console.log('🔍 apiRequest:', { 
        endpoint, 
        method: options.method || 'GET', 
        hasToken: !!token, 
        userRole: user?.role,
        userEmail: user?.email,
        userId: user?._id,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Non-JSON response:', text);
            throw new Error('Server returned non-JSON response. Please check if the server is running correctly.');
        }
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('💥 API Error:', error);
        throw error;
    }
};

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        
        if (response.success) {
            setToken(response.data.token);
            setUser(response.data.user);
        }
        
        return response;
    },

    login: async (credentials) => {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (response.success) {
            setToken(response.data.token);
            setUser(response.data.user);
        }
        
        return response;
    },

    getProfile: async () => {
        return await apiRequest('/auth/profile');
    },

    updateProfile: async (userData) => {
        const response = await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
        
        if (response.success) {
            setUser(response.data.user);
        }
        
        return response;
    },

    changePassword: async (passwordData) => {
        return await apiRequest('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
    },

    logout: () => {
        removeToken();
        removeUser();
    },

    isAuthenticated: () => {
        return !!getToken();
    },

    getCurrentUser: () => {
        return getUser();
    }
};

// Canteen API calls
export const canteenAPI = {
    getAllCanteens: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/canteens${queryString ? `?${queryString}` : ''}`);
    },

    getAdminCanteens: async () => {
        return await apiRequest('/canteens/admin/all');
    },

    getCanteenById: async (id) => {
        return await apiRequest(`/canteens/${id}`);
    },

    createCanteen: async (canteenData) => {
        return await apiRequest('/canteens', {
            method: 'POST',
            body: JSON.stringify(canteenData),
        });
    },

    updateCanteen: async (id, canteenData) => {
        return await apiRequest(`/canteens/${id}`, {
            method: 'PUT',
            body: JSON.stringify(canteenData),
        });
    },

    deleteCanteen: async (id) => {
        return await apiRequest(`/canteens/${id}`, {
            method: 'DELETE',
        });
    },

    getShopOwnerCanteen: async () => {
        console.log('🔍 API: Fetching shop owner canteen');
        return await apiRequest('/canteens/owner/my-canteen');
    },

    getMenuItems: async (canteenId) => {
        console.log('🔍 API: Fetching menu items for canteen:', canteenId);
        return await apiRequest(`/canteens/${canteenId}/menu-items`);
    },

    createMenuItem: async (canteenId, menuItemData) => {
        return await apiRequest(`/canteens/${canteenId}/menu-items`, {
            method: 'POST',
            body: JSON.stringify(menuItemData),
        });
    },

    updateMenuItem: async (itemId, menuItemData) => {
        return await apiRequest(`/menu-items/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(menuItemData),
        });
    },

    deleteMenuItem: async (itemId) => {
        return await apiRequest(`/menu-items/${itemId}`, {
            method: 'DELETE',
        });
    },

    addReview: async (id, reviewData) => {
        return await apiRequest(`/canteens/${id}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }
};

// Reservation API calls
export const reservationAPI = {
    createReservation: async (reservationData) => {
        return await apiRequest('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData),
        });
    },

    getReservations: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/reservations${queryString ? `?${queryString}` : ''}`);
    },

    getReservationById: async (id) => {
        return await apiRequest(`/reservations/${id}`);
    },

    updateReservationStatus: async (id, status) => {
        return await apiRequest(`/reservations/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    deleteReservation: async (id) => {
        return await apiRequest(`/reservations/${id}`, {
            method: 'DELETE',
        });
    },

    getAvailableTimeSlots: async (canteenId, date) => {
        const queryString = new URLSearchParams({ canteenId, date }).toString();
        return await apiRequest(`/reservations/available-slots?${queryString}`);
    }
};

// Article API calls
export const articleAPI = {
    getAllArticles: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/articles${queryString ? `?${queryString}` : ''}`);
    },

    getArticleById: async (id) => {
        return await apiRequest(`/articles/${id}`);
    },

    createArticle: async (articleData) => {
        console.log('🔍 Frontend sending article data:', JSON.stringify(articleData, null, 2));
        const response = await apiRequest('/articles', {
            method: 'POST',
            body: JSON.stringify(articleData),
        });
        console.log('✅ Article creation response:', response);
        return response;
    },

    updateArticle: async (id, articleData) => {
        return await apiRequest(`/articles/${id}`, {
            method: 'PUT',
            body: JSON.stringify(articleData),
        });
    },

    deleteArticle: async (id) => {
        return await apiRequest(`/articles/${id}`, {
            method: 'DELETE',
        });
    },

    getDashboardArticles: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/articles/dashboard${queryString ? `?${queryString}` : ''}`);
    },

    toggleLike: async (id) => {
        return await apiRequest(`/articles/${id}/like`, {
            method: 'POST',
        });
    },

    addComment: async (id, commentData) => {
        return await apiRequest(`/articles/${id}/comment`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    }
};

// User management API (Super Admin only)
export const userAPI = {
    getAllUsers: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiRequest(`/auth/users${queryString ? `?${queryString}` : ''}`);
    },

    createUser: async (userData) => {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    assignCanteen: async (assignmentData) => {
        return await apiRequest('/auth/assign-canteen', {
            method: 'POST',
            body: JSON.stringify(assignmentData),
        });
    },

    toggleUserStatus: async (id) => {
        return await apiRequest(`/auth/users/${id}/toggle-status`, {
            method: 'PATCH',
        });
    }
};

export default {
    authAPI,
    canteenAPI,
    reservationAPI,
    articleAPI,
    userAPI,
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    removeUser
};
