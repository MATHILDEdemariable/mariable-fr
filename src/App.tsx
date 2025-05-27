
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import GuideMariable from "./pages/GuideMariable";
import Professionnels from "./pages/Professionnels";
import GuideMariableFrame from "./pages/GuideMariableFrame";
import LoginFrame from "./pages/LoginFrame";
import MoteurRecherche from "./pages/MoteurRecherche";
import ImportAirtable from './pages/ImportAirtable';
import TestAssistantVirtuel from "./pages/TestAssistantVirtuel";
import WeddingAssistantV2 from "./pages/WeddingAssistantV2";
import PlanningPersonnalise from "./pages/PlanningPersonnalise";
import PlanningResultatsPersonnalises from "./pages/PlanningResultatsPersonnalises";
import ChecklistMariage from "./pages/ChecklistMariage";
import Index from "./pages/Index";

// Services pages
import Prestataires from "./pages/services/Prestataires";
import Planification from "./pages/services/Planification";
import Budget from "./pages/services/Budget";
import Conseils from "./pages/services/Conseils";
import JourJ from "./pages/services/JourJ";

// About pages
import Histoire from "./pages/about/Histoire";
import Charte from "./pages/about/Charte";
import Temoignages from "./pages/about/Temoignages";
import Approche from "./pages/about/Approche";

// Contact pages
import NousContacter from "./pages/contact/NousContacter";
import FAQ from "./pages/contact/FAQ";

// Demo page
import Demo from "./pages/Demo";
import SinglePrestataire from "./pages/prestataire/slug";
import Preview from "./pages/Preview";

// Auth and Dashboard pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/dashboard/UserDashboard";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import Callback from "./pages/auth/Callback";

// Test Formulaire
import TestFormulaire from "./pages/TestFormulaire";

// Admin pages
import AdminPrestataires from "./pages/admin/Prestataires";

// Prestataire pages
import TrackingPage from "./pages/prestataire/tracking";
import ContactTracking from "./pages/prestataire/contact";

// Initialize the query client
const queryClient = new QueryClient();

// Create a helmetContext object to pass to HelmetProvider
const helmetContext = {};

import { ReaderModeProvider } from './contexts/ReaderModeContext';
import ReaderView from './pages/dashboard/ReaderView';
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
                {/* Make LandingPage the main route */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Old index page is now accessible via /home */}
                <Route path="/home" element={<Index />} />
                
                {/* Redirect old landing page route to home */}
                <Route path="/landing" element={<Navigate to="/" replace />} />
                
                {/* Professionals page */}
                <Route path="/professionnels" element={<Professionnels />} />
                
                {/* Services pages */}
                <Route path="/services/prestataires" element={<Prestataires />} />
                <Route path="/services/planification" element={<Planification />} />
                <Route path="/services/budget" element={<Budget />} />
                <Route path="/services/conseils" element={<Conseils />} />
                <Route path="/services/jour-j" element={<JourJ />} />
                
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
                <Route path="/dashboard/*" element={<UserDashboard />} />
                <Route path="/dashboard/lecteur/:token" element={<ReaderView />} />
                
                {/* Redirect for old privacy policy route */}
                <Route path="/politique-confidentialite" element={<Navigate to="/mentions-legales" replace />} />
                
                {/* Demo page */}
                <Route path="/demo" element={<Demo />} />
                {/* <Route path="/preview" element={<Preview />} /> */}
                <Route path="/prestataire/:slug" element={<SinglePrestataire />} />
                
                {/* Moteur de recherche page - now accessible via /guide-mariable route as well */}
                <Route path="/recherche" element={<MoteurRecherche />} />
                <Route path="/guide-mariable" element={<MoteurRecherche />} />
                
                {/* Test Formulaire */}
                <Route path="/test-formulaire" element={<TestFormulaire />} />
                <Route path="/test-assistant-virtuel" element={<TestAssistantVirtuel />} />
                <Route path="/assistant-v2" element={<WeddingAssistantV2 />} />
                <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                <Route path="/planning-personnalise/resultats" element={<PlanningResultatsPersonnalises />} />
                
                {/* Import Airtable */}
                <Route path="/import-airtable" element={<ImportAirtable />} />
                
                {/* Admin Routes */}
                <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                
                {/* Prestataire Routes */}
                <Route path="/prestataire/tracking" element={<TrackingPage />} />
                <Route path="/prestataire/contact" element={<ContactTracking />} />
                
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
