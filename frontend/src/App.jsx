import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoyaltyProvider } from "@/contexts/LoyaltyContext";
import Navbar from "@/components/Navbar";

import { LandingPage } from "./pages/LandingPage";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SuperAdminDashboard from "./pages/SuperAdminDashboardNew";
import ReservationPage from './pages/ReservationPage';
import BlogFeed from "./pages/BlogFeed";
import BlogPostDetail from "./pages/BlogPostDetail";
import WriteArticle from "./pages/WriteArticle";
import Offers from "./pages/Offers";
import NotFound from "./pages/NotFound";
import SimpleArticleCreation from "./pages/SimpleArticleCreation";
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<SuperAdminDashboard />} />
              <Route path="/admin/create-article" element={<SimpleArticleCreation />} />
              <Route path="/admin/news" element={<BlogFeed />} />
              <Route path="/blog" element={<Navigate to="/admin/news" replace />} />
              <Route path="/canteens" element={<Index />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/admin/offers" element={<Offers />} />
              <Route path="/blog/:id" element={<BlogPostDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LoyaltyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
