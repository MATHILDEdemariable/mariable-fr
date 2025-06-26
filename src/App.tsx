
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ReaderModeProvider } from '@/contexts/ReaderModeContext';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MoteurRecherche from './pages/MoteurRecherche';
import ReservationJourM from './pages/ReservationJourM';
import DemoJourM from './pages/DemoJourM';
import ChecklistMariage from './pages/ChecklistMariage';
import PlanningPersonnalise from './pages/PlanningPersonnalise';
import Pricing from './pages/Pricing';
import Professionnels from './pages/Professionnels';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import BlogArticle from './pages/BlogArticle';
import DashboardLayout from './components/dashboard/DashboardLayout';
import UserDashboard from './pages/dashboard/UserDashboard';
import PlanningPage from './pages/dashboard/PlanningPage';
import ChecklistPage from './pages/dashboard/ChecklistPage';
import BudgetPage from './pages/dashboard/BudgetPage';
import VendorTrackingPage from './pages/dashboard/VendorTrackingPage';
import WishlistPage from './pages/dashboard/WishlistPage';
import CoordinationPage from './pages/dashboard/CoordinationPage';
import AssistantPage from './pages/dashboard/AssistantPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPrestataires from './pages/admin/Prestataires';
import ReservationsJourM from './pages/admin/ReservationsJourM';
import Blog from './pages/admin/Blog';
import FormAdmin from './pages/admin/FormAdmin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AnalyticsProvider>
            <ReaderModeProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/selection" element={<MoteurRecherche />} />
                  <Route path="/recherche" element={<MoteurRecherche />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/demo-jour-m" element={<DemoJourM />} />
                  <Route path="/checklist-mariage" element={<ChecklistMariage />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/professionnels" element={<Professionnels />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<UserDashboard />} />
                    <Route path="planning" element={<PlanningPage />} />
                    <Route path="tasks" element={<ChecklistPage />} />
                    <Route path="budget" element={<BudgetPage />} />
                    <Route path="prestataires" element={<VendorTrackingPage />} />
                    <Route path="wishlist" element={<WishlistPage />} />
                    <Route path="coordination" element={<CoordinationPage />} />
                    <Route path="assistant" element={<AssistantPage />} />
                  </Route>

                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                  <Route path="/admin/reservations-jour-m" element={<ReservationsJourM />} />
                  <Route path="/admin/blog" element={<Blog />} />
                  <Route path="/admin/form" element={<FormAdmin />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ReaderModeProvider>
          </AnalyticsProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
