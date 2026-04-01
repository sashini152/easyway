import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const users = [
  { id: 1, name: "Super Admin", email: "admin@sliit.lk", password: "ADMIN123456", role: "super_admin" },
  { id: 2, name: "Student", email: "student@sliit.lk", password: "STD123456", role: "student" },
  { id: 3, name: "Shop Admin", email: "pscanteen@sliit.lk", password: "PNS123456", role: "shop_admin" },
  { id: 4, name: "Canteen Admin", email: "canteen.admin@sliit.lk", password: "ADMIN123", role: "canteen_admin" },
  { id: 5, name: "Canteen Owner", email: "canteen.owner@sliit.lk", password: "OWNER123", role: "canteen_owner" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("canteenAdmin");
    localStorage.removeItem("canteenOwner");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
