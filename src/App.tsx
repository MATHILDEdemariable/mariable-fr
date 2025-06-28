
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MonJourMPage from "./pages/MonJourM";
import MonJourMPlanning from "./pages/MonJourMPlanning";
import PlanningPartage from "./pages/PlanningPartage";
import SearchPrestataires from "./pages/SearchPrestataires";
import PrestataireDetail from "./pages/PrestataireDetail";
import BlogPage from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import ContactPage from "./pages/Contact";
import AuthWrapper from "./components/AuthWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/prestataires" element={<SearchPrestataires />} />
            <Route path="/prestataire/:id" element={<PrestataireDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/planning-partage/:token" element={<PlanningPartage />} />
            <Route
              path="/dashboard"
              element={
                <AuthWrapper>
                  <Dashboard />
                </AuthWrapper>
              }
            />
            <Route
              path="/mon-jour-m"
              element={
                <AuthWrapper>
                  <MonJourMPage />
                </AuthWrapper>
              }
            />
            <Route
              path="/mon-jour-m/planning"
              element={
                <AuthWrapper>
                  <MonJourMPlanning />
                </AuthWrapper>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AuthWrapper requireAdmin>
                  <AdminDashboard />
                </AuthWrapper>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
