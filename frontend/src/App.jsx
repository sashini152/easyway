import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoyaltyProvider } from "@/contexts/LoyaltyContext";
import Navbar from "@/components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import Index from "./pages/Index";
import ShopDetail from "./pages/ShopDetail";
import { ReservationPage } from './pages/ReservationPage';
import BlogFeed from "./pages/BlogFeed";
import BlogPostDetail from "./pages/BlogPostDetail";
import Login from "./pages/Login";
import WriteArticle from "./pages/WriteArticle";
import ShopAdminDashboard from "./pages/ShopAdminDashboard";
import PostManagement from "./pages/PostManagement";
import CommentManagement from "./pages/CommentManagement";
import ArticleManagement from "./pages/ArticleManagement";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminCanteenManagement from "./pages/AdminCanteenManagement";
import CanteenAdminLogin from "./pages/CanteenAdminLogin";
import CanteenAdminDashboard from "./pages/CanteenAdminDashboard";
import CanteenOwnerLogin from "./pages/CanteenOwnerLogin";
import CanteenOwnerDashboard from "./pages/CanteenOwnerDashboard";
import Offers from "./pages/Offers";
import NotFound from "./pages/NotFound";
import "./styles/landing.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LoyaltyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/canteens" element={<Index />} />
              <Route path="/shop/:id" element={<ShopDetail />} />
              <Route path="/blog" element={<BlogFeed />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="/blog/new" element={<WriteArticle />} />
              <Route path="/login" element={<Login />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/dashboard" element={<ShopAdminDashboard />} />
              <Route path="/dashboard/posts" element={<PostManagement />} />
              <Route path="/dashboard/comments" element={<CommentManagement />} />
              <Route path="/article-management" element={<ArticleManagement />} />
              <Route path="/admin" element={<SuperAdminDashboard />} />
              <Route path="/admin/canteens" element={<AdminCanteenManagement />} />
              <Route path="/canteen-admin/login" element={<CanteenAdminLogin />} />
              <Route path="/canteen-admin/dashboard" element={<CanteenAdminDashboard />} />
              <Route path="/canteen-owner/login" element={<CanteenOwnerLogin />} />
              <Route path="/canteen-owner/dashboard" element={<CanteenOwnerDashboard />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/reservation" element={<ReservationPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LoyaltyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
