
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmailCapture from "./pages/EmailCapture";

// Services pages
import Prestataires from "./pages/services/Prestataires";
import Planification from "./pages/services/Planification";
import Budget from "./pages/services/Budget";
import Conseils from "./pages/services/Conseils";

// About pages
import Histoire from "./pages/about/Histoire";
import Charte from "./pages/about/Charte";
import Temoignages from "./pages/about/Temoignages";

// Contact pages
import NousContacter from "./pages/contact/NousContacter";
import FAQ from "./pages/contact/FAQ";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Email capture page */}
          <Route path="/commencer" element={<EmailCapture />} />
          
          {/* Services pages */}
          <Route path="/services/prestataires" element={<Prestataires />} />
          <Route path="/services/planification" element={<Planification />} />
          <Route path="/services/budget" element={<Budget />} />
          <Route path="/services/conseils" element={<Conseils />} />
          
          {/* About pages */}
          <Route path="/about/histoire" element={<Histoire />} />
          <Route path="/about/charte" element={<Charte />} />
          <Route path="/about/temoignages" element={<Temoignages />} />
          
          {/* Contact pages */}
          <Route path="/contact/nous-contacter" element={<NousContacter />} />
          <Route path="/contact/faq" element={<FAQ />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
