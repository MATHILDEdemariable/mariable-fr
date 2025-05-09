
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import GuideMariable from "./pages/GuideMariable";
import Professionnels from "./pages/Professionnels";
import GuideMariableFrame from "./pages/GuideMariableFrame";
import LoginFrame from "./pages/LoginFrame";
import MoteurRecherche from "./pages/MoteurRecherche";
import ImportAirtable from './pages/ImportAirtable';

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
// import TrackingPage from "./pages/prestataire/tracking";




// Composant pour scroller en haut de la page à chaque changement de route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Professionals page */}
            <Route path="/professionnels" element={<Professionnels />} />
            
            {/* Services pages */}
            <Route path="/services/prestataires" element={<Prestataires />} />
            <Route path="/services/planification" element={<Planification />} />
            <Route path="/services/budget" element={<Budget />} />
            <Route path="/services/conseils" element={<Conseils />} />
            <Route path="/services/jour-j" element={<JourJ />} />
            
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
            
            {/* Redirect for old privacy policy route */}
            <Route path="/politique-confidentialite" element={<Navigate to="/mentions-legales" replace />} />
            
            {/* Demo page */}
            <Route path="/demo" element={<Demo />} />
            <Route path="/preview" element={<Preview />} />
            
            {/* Moteur de recherche page */}
            <Route path="/recherche" element={<MoteurRecherche />} />
            
            {/* Test Formulaire */}
            <Route path="/test-formulaire" element={<TestFormulaire />} />
            
            {/* Import Airtable */}
            <Route path="/import-airtable" element={<ImportAirtable />} />

            {/* Admin Routes */}
            <Route path="/admin/prestataires" element={<AdminPrestataires />} />


            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
