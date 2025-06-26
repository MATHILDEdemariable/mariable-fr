
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import MonJourMPlanningPage from "./pages/MonJourMPlanning";
import MonJourMEquipePage from "./pages/MonJourMEquipe";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Pricing from "./pages/Pricing";
import Paiement from "./pages/Paiement";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogArticle";
import Contact from "./pages/contact/NousContacter";
import MentionsLegales from "./pages/MentionsLegales";
import Prestataires from "./pages/services/Prestataires";
import Prestataire from "./pages/prestataire/slug";
import EmailConfirmation from "./pages/auth/EmailConfirmation";

// Import admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/Blog";
import AdminPrestataires from "./pages/admin/Prestataires";
import AdminForm from "./pages/admin/FormAdmin";
import AdminReservationsJourM from "./pages/admin/ReservationsJourM";

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
                  <Route path="/selection" element={<MoteurRecherche />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/planning-resultats-personnalises" element={<PlanningResultatsPersonnalises />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/dashboard/*" element={<UserDashboard />} />
                  <Route path="/jour-m-vue/:token" element={<JourMVue />} />
                  
                  {/* Mon Jour-M routes */}
                  <Route path="/mon-jour-m" element={<Navigate to="/mon-jour-m/planning" replace />} />
                  <Route path="/mon-jour-m/planning" element={<MonJourMPlanningPage />} />
                  <Route path="/mon-jour-m/equipe" element={<MonJourMEquipePage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />
                  <Route path="/auth/email-confirmation" element={<Navigate to="/email-confirmation" replace />} />

                  {/* Static routes */}
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/paiement" element={<Paiement />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />

                  {/* Prestataires routes */}
                  <Route path="/prestataires" element={<Prestataires />} />
                  <Route path="/prestataires/:slug" element={<Prestataire />} />

                  {/* Admin routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/blog" element={<AdminBlog />} />
                  <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                  <Route path="/admin/form" element={<AdminForm />} />
                  <Route path="/admin/reservations-jour-m" element={<AdminReservationsJourM />} />
                  
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
