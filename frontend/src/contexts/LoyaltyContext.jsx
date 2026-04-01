import { createContext, useContext, useState, useEffect } from "react";
import { storage, STORAGE_KEYS } from "@/lib/storage";

const LoyaltyContext = createContext();

const loyaltyRewards = [
  { id: 1, name: "Free Rice", points: 100, description: "Get a free rice portion" },
  { id: 2, name: "10% Discount", points: 50, description: "Get 10% off your next order" },
  { id: 3, name: "Free Drink", points: 75, description: "Get a free drink with your meal" },
  { id: 4, name: "Free Dessert", points: 60, description: "Get a free dessert" }
];

export const LoyaltyProvider = ({ children }) => {
  const [userPoints, setUserPoints] = useState({});
  const [cart, setCart] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState(() => 
    storage.get(STORAGE_KEYS.REDEEMED_REWARDS, [])
  );

  // Load user points from localStorage
  useEffect(() => {
    const savedPoints = storage.get(STORAGE_KEYS.USER_POINTS, {});
    setUserPoints(savedPoints);
  }, []);

  // Save user points to localStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.USER_POINTS, userPoints);
  }, [userPoints]);

  // Save redeemed rewards to localStorage
  useEffect(() => {
    storage.set(STORAGE_KEYS.REDEEMED_REWARDS, redeemedRewards);
  }, [redeemedRewards]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const processPurchase = (userId, totalAmount) => {
    const pointsEarned = Math.floor(totalAmount / 10); // 1 point per Rs. 10
    setUserPoints(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + pointsEarned
    }));
    setCart([]);
  };

  const redeemReward = (userId, rewardId) => {
    const reward = loyaltyRewards.find(r => r.id === rewardId);
    const userCurrentPoints = userPoints[userId] || 0;
    
    if (userCurrentPoints >= reward.points) {
      setUserPoints(prev => ({
        ...prev,
        [userId]: userCurrentPoints - reward.points
      }));
      
      const newRedemption = {
        id: Date.now(),
        userId,
        rewardId,
        rewardName: reward.name,
        redeemedAt: new Date().toISOString()
      };
      
      setRedeemedRewards(prev => [...prev, newRedemption]);
      return true;
    }
    return false;
  };

  const useRedeemedReward = (redemptionId) => {
    setRedeemedRewards(prev => prev.filter(r => r.id !== redemptionId));
  };

  const getUserPoints = (userId) => {
    return userPoints[userId] || 0;
  };

  const getRedeemedRewards = (userId) => {
    return redeemedRewards.filter(r => r.userId === userId);
  };

  const value = {
    userPoints,
    cart,
    loyaltyRewards,
    redeemedRewards,
    addToCart,
    removeFromCart,
    updateQuantity,
    processPurchase,
    redeemReward,
    useRedeemedReward,
    getUserPoints,
    getRedeemedRewards
  };

  return (
    <LoyaltyContext.Provider value={value}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (context === undefined) {
    throw new Error("useLoyalty must be used within a LoyaltyProvider");
  }
  return context;
};
