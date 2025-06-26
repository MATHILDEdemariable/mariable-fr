import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ReaderModeProvider } from '@/contexts/ReaderModeContext';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MoteurRecherche from './pages/MoteurRecherche';
import ReservationJourM from './pages/ReservationJourM';
import DemoJourM from './pages/DemoJourM';
import ChecklistMariage from './pages/ChecklistMariage';
import PlanningPersonnalise from './pages/PlanningPersonnalise';
import Pricing from './pages/Pricing';
import Selection from './pages/Selection';
import Register from './pages/Register';
import ServicesBudget from './pages/ServicesBudget';
import AboutHistoire from './pages/AboutHistoire';
import AboutApproche from './pages/AboutApproche';
import AboutCharte from './pages/AboutCharte';
import ContactNousContacter from './pages/ContactNousContacter';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import Professionnels from './pages/Professionnels';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Planning from './pages/dashboard/Planning';
import Tasks from './pages/dashboard/Tasks';
import Budget from './pages/dashboard/Budget';
import Prestataires from './pages/dashboard/Prestataires';
import Wishlist from './pages/dashboard/Wishlist';
import SettingsDashboard from './pages/dashboard/SettingsDashboard';
import Coordination from './pages/dashboard/Coordination';
import Drinks from './pages/dashboard/Drinks';
import Assistant from './pages/dashboard/Assistant';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPrestataires from './pages/admin/Prestataires';
import ReservationsJourM from './pages/admin/ReservationsJourM';
import Blog from './pages/admin/Blog';
import Form from './pages/admin/Form';
import BlogArticle from './pages/BlogArticle';
import { GoogleAnalytics } from './components/analytics/GoogleAnalytics';

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
                  <Route path="/register" element={<Register />} />
                  <Route path="/services/budget" element={<ServicesBudget />} />
                  <Route path="/about/histoire" element={<AboutHistoire />} />
                  <Route path="/about/approche" element={<AboutApproche />} />
                  <Route path="/about/charte" element={<AboutCharte />} />
                  <Route path="/contact/nous-contacter" element={<ContactNousContacter />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/professionnels" element={<Professionnels />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="planning" element={<Planning />} />
                    <Route path="tasks" element={<Tasks />} />
                    <Route path="budget" element={<Budget />} />
                    <Route path="prestataires" element={<Prestataires />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="settings" element={<SettingsDashboard />} />
                    <Route path="coordination" element={<Coordination />} />
                    <Route path="drinks" element={<Drinks />} />
                    <Route path="assistant" element={<Assistant />} />
                  </Route>

                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                  <Route path="/admin/reservations-jour-m" element={<ReservationsJourM />} />
                  <Route path="/admin/blog" element={<Blog />} />
                  <Route path="/admin/form" element={<Form />} />
                  
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
