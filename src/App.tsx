import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Loader2 } from "lucide-react";
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";
import { ReaderModeProvider } from "./contexts/ReaderModeContext";

// Lazy load all components
const Index = React.lazy(() => import("./pages/Index"));
const Contact = React.lazy(() => import("./pages/contact/NousContacter"));
const Coordination = React.lazy(() => import("./pages/services/Planification"));
const Legal = React.lazy(() => import("./pages/MentionsLegales"));
const Mariage = React.lazy(() => import("./pages/services/Prestataires"));
const Mentions = React.lazy(() => import("./pages/MentionsLegales"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Politique = React.lazy(() => import("./pages/CGV"));
const Prestations = React.lazy(() => import("./pages/services/Prestataires"));
const Reservation = React.lazy(() => import("./pages/ReservationJourM"));
const ReservationJourM = React.lazy(() => import("./pages/ReservationJourM"));
const Team = React.lazy(() => import("./pages/about/Histoire"));
const Valeurs = React.lazy(() => import("./pages/about/Charte"));
const Admin = React.lazy(() => import("./pages/admin/FormAdmin"));
const JourMReservations = React.lazy(() => import("./pages/admin/JourMReservations"));

// Authentication pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Callback = React.lazy(() => import("./pages/auth/Callback"));

// Dashboard and main pages
const UserDashboard = React.lazy(() => import("./pages/dashboard/UserDashboard"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const MoteurRecherche = React.lazy(() => import("./pages/MoteurRecherche"));
const ChecklistMariage = React.lazy(() => import("./pages/ChecklistMariage"));
const PlanningPersonnalise = React.lazy(() => import("./pages/PlanningPersonnalise"));

// Services pages
const Budget = React.lazy(() => import("./pages/services/Budget"));
const Planification = React.lazy(() => import("./pages/services/Planification"));
const Conseils = React.lazy(() => import("./pages/services/Conseils"));

// Prestataire pages
const SinglePrestataire = React.lazy(() => import("./pages/prestataire/slug"));

// Test pages
const TestAssistantVirtuel = React.lazy(() => import("./pages/TestAssistantVirtuel"));
const WeddingAssistantV2 = React.lazy(() => import("./pages/WeddingAssistantV2"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-wedding-cream/10">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-wedding-olive mx-auto mb-4" />
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ReaderModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnalyticsProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Main pages */}
                  <Route path="/" element={<Index />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/recherche" element={<MoteurRecherche />} />
                  <Route path="/checklist-mariage" element={<ChecklistMariage />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  
                  {/* Authentication routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/auth/callback" element={<Callback />} />
                  
                  {/* Dashboard routes */}
                  <Route path="/dashboard/*" element={<UserDashboard />} />
                  
                  {/* Services routes */}
                  <Route path="/services/budget" element={<Budget />} />
                  <Route path="/services/prestataires" element={<Prestations />} />
                  <Route path="/services/planification" element={<Planification />} />
                  <Route path="/services/conseils" element={<Conseils />} />
                  
                  {/* Prestataire routes */}
                  <Route path="/prestataire/:slug" element={<SinglePrestataire />} />
                  
                  {/* Test pages */}
                  <Route path="/test-assistant" element={<TestAssistantVirtuel />} />
                  <Route path="/assistant-v2" element={<WeddingAssistantV2 />} />
                  
                  {/* Existing routes from original App.tsx */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/coordination" element={<Coordination />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="/mariage" element={<Mariage />} />
                  <Route path="/mentions" element={<Mentions />} />
                  <Route path="/politique" element={<Politique />} />
                  <Route path="/prestations" element={<Prestations />} />
                  <Route path="/reservation" element={<Reservation />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/valeurs" element={<Valeurs />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/jour-m" element={<JourMReservations />} />
                  
                  {/* 404 route - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AnalyticsProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ReaderModeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
