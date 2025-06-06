
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ReaderModeProvider } from '@/contexts/ReaderModeContext';
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import GuideMariable from "./pages/GuideMariable";
import GuideMariableFrame from "./pages/GuideMariableFrame";
import LoginFrame from "./pages/LoginFrame";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Callback from "./pages/auth/Callback";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import UserDashboard from "./pages/dashboard/UserDashboard";
import ReaderView from "./pages/dashboard/ReaderView";
import MoteurRecherche from "./pages/MoteurRecherche";
import Histoire from "./pages/about/Histoire";
import Charte from "./pages/about/Charte";
import Approche from "./pages/about/Approche";
import Temoignages from "./pages/about/Temoignages";
import NousContacter from "./pages/contact/NousContacter";
import FAQ from "./pages/contact/FAQ";
import Prestataires from "./pages/services/Prestataires";
import Professionnels from "./pages/Professionnels";
import NotFound from "./pages/NotFound";
import FormAdmin from "./pages/admin/FormAdmin";
import PrestataireAdmin from "./pages/admin/Prestataires";
import ReservationsJourM from "./pages/admin/ReservationsJourM";
import ImportAirtable from "./pages/ImportAirtable";
import ChecklistMariage from "./pages/ChecklistMariage";
import PlanningPersonnalise from "./pages/PlanningPersonnalise";
import PlanningResultatsPersonnalises from "./pages/PlanningResultatsPersonnalises";
import WeddingAssistantV2 from "./pages/WeddingAssistantV2";
import EmailCapture from "./pages/EmailCapture";
import Preview from "./pages/Preview";
import TestFormulaire from "./pages/TestFormulaire";
import TestAssistantVirtuel from "./pages/TestAssistantVirtuel";
import LandingPage from "./pages/LandingPage";
import ServiceTemplate from "./pages/ServiceTemplate";
import PrestatairePage from "./pages/prestataire/slug";
import PrestataireContactPage from "./pages/prestataire/contact";
import PrestataireTrackingPage from "./pages/prestataire/tracking";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import Pricing from "./pages/Pricing";
import ReservationJourM from "./pages/ReservationJourM";
import Budget from "./pages/services/Budget";

// Initialize the query client
const queryClient = new QueryClient();

// Create a helmetContext object to pass to HelmetProvider
const helmetContext = {};

import AnalyticsProvider from './components/analytics/AnalyticsProvider';

const App = () => {
  return(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider context={helmetContext}>
      <ReaderModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsProvider>
              <Routes>
                {/* Make Index page the main route */}
                <Route path="/" element={<Index />} />
                
                {/* Move LandingPage to /landing route */}
                <Route path="/landing" element={<LandingPage />} />
                
                {/* Old index page is now accessible via /home */}
                <Route path="/home" element={<Index />} />
                
                {/* Professionals page */}
                <Route path="/professionnels" element={<Professionnels />} />
                
                {/* Services pages */}
                <Route path="/services/prestataires" element={<Prestataires />} />
                <Route path="/services/budget" element={<Budget />} />
                
                {/* Pricing page */}
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Reservation Le Jour M */}
                <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                
                {/* Checklist page */}
                <Route path="/checklist-mariage" element={<ChecklistMariage />} />
                
                {/* Guide Mariable */}
                <Route path="/guide-mariable" element={<GuideMariable />} />
                <Route path="/guide-mariable-frame" element={<GuideMariableFrame />} />
                <Route path="/login-frame" element={<LoginFrame />} />
                
                {/* About pages */}
                <Route path="/about/histoire" element={<Histoire />} />
                <Route path="/about/charte" element={<Charte />} />
                <Route path="/about/temoignages" element={<Temoignages />} />
                <Route path="/about/approche" element={<Approche />} />
                
                {/* Contact pages */}
                <Route path="/contact/nous-contacter" element={<NousContacter />} />
                <Route path="/contact/faq" element={<FAQ />} />
                
                {/* Legal pages */}
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/cgv" element={<CGV />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/email-confirmation" element={<EmailConfirmation />} />
                <Route path="/auth/callback" element={<Callback />} />
                
                {/* Public Reader View - MUST come before protected dashboard routes */}
                <Route path="/dashboard/lecteur/:token" element={<ReaderView />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard/*" element={<UserDashboard />} />
                
                {/* Redirect for old privacy policy route */}
                <Route path="/politique-confidentialite" element={<Navigate to="/mentions-legales" replace />} />
                
                {/* Demo page */}
                <Route path="/demo" element={<Demo />} />
                <Route path="/prestataire/:slug" element={<PrestatairePage />} />
                
                {/* Moteur de recherche page - now accessible via /selection (renamed from /recherche) */}
                <Route path="/selection" element={<MoteurRecherche />} />
                <Route path="/guide-mariable" element={<MoteurRecherche />} />
                
                {/* Redirect old /recherche URL to new /selection URL */}
                <Route path="/recherche" element={<Navigate to="/selection" replace />} />
                
                {/* Planning personnalisé */}
                <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                <Route path="/planning-personnalise/resultats" element={<PlanningResultatsPersonnalises />} />
                
                {/* Test Formulaire */}
                <Route path="/test-formulaire" element={<TestFormulaire />} />
                <Route path="/test-assistant-virtuel" element={<TestAssistantVirtuel />} />
                <Route path="/assistant-v2" element={<WeddingAssistantV2 />} />
                
                {/* Import Airtable */}
                <Route path="/import-airtable" element={<ImportAirtable />} />
                
                {/* Admin Routes */}
                <Route path="/admin/prestataires" element={<PrestataireAdmin />} />
                <Route path="/admin/form" element={<FormAdmin />} />
                <Route path="/admin/reservations-jour-m" element={<ReservationsJourM />} />
                
                {/* Prestataire Routes */}
                <Route path="/prestataire/tracking" element={<PrestataireTrackingPage />} />
                <Route path="/prestataire/contact" element={<PrestataireContactPage />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnalyticsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ReaderModeProvider>
    </HelmetProvider>
  </QueryClientProvider>
  );
};

export default App;
