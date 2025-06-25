
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { HelmetProvider } from 'react-helmet-async';
import { ReaderModeProvider } from '@/contexts/ReaderModeContext';

// Import pages
import Index from "./pages/Index";
import MoteurRecherche from "./pages/MoteurRecherche";
import PlanningPersonnalise from "./pages/PlanningPersonnalise";
import PlanningResultatsPersonnalises from "./pages/PlanningResultatsPersonnalises";
import NotFound from "./pages/NotFound";
import ReservationJourM from "./pages/ReservationJourM";
import UserDashboard from "./pages/dashboard/UserDashboard";
import JourMVue from "./pages/JourMVue";
import MonJourM from "./pages/MonJourM";
import Login from "./pages/auth/Login";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogArticle";
import Contact from "./pages/contact/NousContacter";
import MentionsLegales from "./pages/MentionsLegales";
import Prestataires from "./pages/services/Prestataires";
import Prestataire from "./pages/prestataire/slug";
import EmailConfirmation from "./pages/auth/EmailConfirmation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ReaderModeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/moteur-recherche" element={<MoteurRecherche />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/planning-resultats-personnalises" element={<PlanningResultatsPersonnalises />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/dashboard/*" element={<UserDashboard />} />
                  <Route path="/jour-m-vue/:token" element={<JourMVue />} />
                  
                  {/* Mon Jour-M routes */}
                  <Route path="/mon-jour-m" element={<MonJourM />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />

                  {/* Static routes */}
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />

                  {/* Prestataires routes */}
                  <Route path="/prestataires" element={<Prestataires />} />
                  <Route path="/prestataires/:slug" element={<Prestataire />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnalyticsProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ReaderModeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
