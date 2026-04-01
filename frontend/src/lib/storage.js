export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

export const storage = {
  get: (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? safeJsonParse(item, defaultValue) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('storage-update', { 
        detail: { key, value } 
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  remove: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(new CustomEvent('storage-update', { 
        detail: { key, value: null } 
      }));
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export const STORAGE_KEYS = {
  COMMENTS: 'comments',
  OFFERS: 'offers',
  COMMENT_REACTIONS: 'comment_reactions',
  BLOG_POSTS: 'blog_posts',
  SHOPS: 'shops',
  USER_PREFERENCES: 'user_preferences',
  CART_ITEMS: 'cart_items'
};
