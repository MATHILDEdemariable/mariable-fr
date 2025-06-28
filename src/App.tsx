
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
import Index from "./pages/Index"
import Login from "./pages/auth/Login"
import Dashboard from "./pages/dashboard/UserDashboard"
import Register from "./pages/auth/Register"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import MonJourMPage from "./pages/MonJourM"
import MonJourMPlanning from "./pages/MonJourMPlanning"
import PlanningPartagePage from "./pages/PlanningPartage"
import SearchPrestataires from "./pages/services/Prestataires"
import PrestataireDetail from "./pages/prestataire/slug"
import BlogPage from "./pages/Blog"
import BlogPostPage from "./pages/BlogArticle"
import ContactPage from "./pages/contact/NousContacter"
import DashboardLayout from "./components/dashboard/DashboardLayout"

const queryClient = new QueryClient()

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
            <Route path="/planning-partage/:token" element={<PlanningPartagePage />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/mon-jour-m"
              element={
                <DashboardLayout>
                  <MonJourMPage />
                </DashboardLayout>
              }
            />
            <Route
              path="/mon-jour-m/planning"
              element={
                <DashboardLayout>
                  <MonJourMPlanning />
                </DashboardLayout>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmelProvider>
  </QueryClientProvider>
)

export default App
