import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmailCapture from "./pages/EmailCapture";
import MentionsLegales from "./pages/MentionsLegales";
import CGV from "./pages/CGV";
import GuideMariable from "./pages/GuideMariable";
import Professionnels from "./pages/Professionnels";
import GuideMariableFrame from "./pages/GuideMariableFrame";
import LoginFrame from "./pages/LoginFrame";

// Services pages
import Prestataires from "./pages/services/Prestataires";
import Planification from "./pages/services/Planification";
import Budget from "./pages/services/Budget";
import Conseils from "./pages/services/Conseils";

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
            
            {/* Email capture page */}
            <Route path="/commencer" element={<EmailCapture />} />
            
            {/* Professionals page */}
            <Route path="/professionnels" element={<Professionnels />} />
            
            {/* Services pages */}
            <Route path="/services/prestataires" element={<Prestataires />} />
            <Route path="/services/planification" element={<Planification />} />
            <Route path="/services/budget" element={<Budget />} />
            <Route path="/services/conseils" element={<Conseils />} />
            
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
            
            {/* Redirect for old privacy policy route */}
            <Route path="/politique-confidentialite" element={<Navigate to="/mentions-legales" replace />} />
            
            {/* Demo page */}
            <Route path="/demo" element={<Demo />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
