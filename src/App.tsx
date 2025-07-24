import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { HelmetProvider } from 'react-helmet-async';
import { ReaderModeProvider } from '@/contexts/ReaderModeContext';
import PaymentSuccessHandler from '@/components/premium/PaymentSuccessHandler';

// Import pages
import Index from "./pages/Index";
import MoteurRecherche from "./pages/MoteurRecherche";
import PlanningPersonnalise from "./pages/PlanningPersonnalise";
import PlanningResultatsPersonnalises from "./pages/PlanningResultatsPersonnalises";
import NotFound from "./pages/NotFound";
import ReservationJourM from "./pages/ReservationJourM";
import UserDashboard from "./pages/dashboard/UserDashboard";
import JourMVue from "./pages/JourMVue";
import PlanningPublic from "./pages/PlanningPublic";
import PlanningPublicProject from "./pages/PlanningPublicProject";
import MonJourM from "./pages/MonJourM";
import MonJourMPlanningPage from "./pages/MonJourMPlanning";
import MonJourMEquipePage from "./pages/MonJourMEquipe";
import MonJourMDocumentsPage from "./pages/MonJourMDocuments";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Pricing from "./pages/Pricing";
import Paiement from "./pages/Paiement";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogArticle";
import Contact from "./pages/contact/NousContacter";
import MentionsLegales from "./pages/MentionsLegales";
import Prestataires from "./pages/services/Prestataires";
import Budget from "./pages/services/Budget";
import Prestataire from "./pages/prestataire/slug";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import MessageHistoryPage from "./pages/dashboard/MessageHistoryPage";

// Import missing pages
import Professionnels from "./pages/Professionnels";
import Approche from "./pages/about/Approche";
import Histoire from "./pages/about/Histoire";
import Charte from "./pages/about/Charte";
import Temoignages from "./pages/about/Temoignages";
import CGV from "./pages/CGV";
import FAQ from "./pages/contact/FAQ";
import ChecklistMariage from "./pages/ChecklistMariage";
import Accompagnement from "./pages/Accompagnement";
import LivreBlanc from "./pages/LivreBlanc";
import CoordinateursMarriage from "./pages/CoordinateursMarriage";

// Import admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/Blog";
import AdminUsers from "./pages/admin/Users";
import AdminPaiements from "./pages/admin/Paiements";
import AdminPrestataires from "./pages/admin/Prestataires";
import AdminForm from "./pages/admin/FormAdmin";
import AdminReservationsJourM from "./pages/admin/ReservationsJourM";
import AdminSystemCheck from "./pages/admin/SystemCheck";
import AdminProfessionalRegistrations from "./pages/admin/ProfessionalRegistrations";

// Import Jeunes Mariés pages
import JeunesMaries from "./pages/JeunesMaries";
import JeuneMariesInscription from "./pages/JeuneMariesInscription";
import JeuneMariesDetail from "./pages/JeuneMariesDetail";
import AdminJeunesMaries from "./pages/admin/AdminJeunesMaries";

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
                <PaymentSuccessHandler />
                <Routes>
                  <Route path="/" element={<Index />} />
                   <Route path="/moteur-recherche" element={<MoteurRecherche />} />
          <Route path="/selection" element={<MoteurRecherche />} />
          <Route path="/mariage/:region" element={<MoteurRecherche />} />
          <Route path="/coordinateurs-mariage" element={<CoordinateursMarriage />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/planning-resultats-personnalises" element={<PlanningResultatsPersonnalises />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/dashboard/*" element={<UserDashboard />} />
                  <Route path="/jour-m-vue/:token" element={<JourMVue />} />
                  
                  {/* Routes publiques pour les plannings */}
                  <Route path="/planning-public/:coordinationId" element={<PlanningPublic />} />
                  <Route path="/planning-public/project/:token" element={<PlanningPublicProject />} />
                  
                  {/* Mon Jour-M routes */}
                  <Route path="/mon-jour-m" element={<Navigate to="/mon-jour-m/planning" replace />} />
                  <Route path="/mon-jour-m/planning" element={<MonJourMPlanningPage />} />
                  <Route path="/mon-jour-m/equipe" element={<MonJourMEquipePage />} />
                  <Route path="/mon-jour-m/documents" element={<MonJourMDocumentsPage />} />

                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />
                  <Route path="/auth/email-confirmation" element={<Navigate to="/email-confirmation" replace />} />

                  {/* Static routes */}
                  <Route path="/detail-coordination-jourm" element={<Pricing />} />
                  <Route path="/paiement" element={<Paiement />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  
                  {/* Missing routes - Fixed */}
                  <Route path="/professionnels" element={<Professionnels />} />
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/contact/faq" element={<FAQ />} />
                  <Route path="/checklist-mariage" element={<ChecklistMariage />} />
                  <Route path="/accompagnement" element={<Accompagnement />} />
                  <Route path="/livre-blanc" element={<LivreBlanc />} />

                   {/* À propos routes - Fixed */}
                   <Route path="/about/approche" element={<Approche />} />
                   <Route path="/about/histoire" element={<Histoire />} />
                   <Route path="/about/charte" element={<Charte />} />
                   <Route path="/about/temoignages" element={<Temoignages />} />

                   {/* Jeunes Mariés routes */}
                   <Route path="/jeunes-maries" element={<JeunesMaries />} />
                   <Route path="/jeunes-maries/inscription" element={<JeuneMariesInscription />} />
                   <Route path="/jeunes-maries/:slug" element={<JeuneMariesDetail />} />

                  {/* Prestataires routes */}
                  <Route path="/prestataires" element={<Prestataires />} />
                  <Route path="/prestataires/:slug" element={<Prestataire />} />
                  <Route path="/prestataire/:slug" element={<Prestataire />} />

                   {/* Admin routes */}
                   <Route path="/admin/dashboard" element={<AdminDashboard />} />
                   <Route path="/admin/blog" element={<AdminBlog />} />
                   <Route path="/admin/users" element={<AdminUsers />} />
                   <Route path="/admin/paiements" element={<AdminPaiements />} />
                   <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                   <Route path="/admin/professional-registrations" element={<AdminProfessionalRegistrations />} />
                   <Route path="/admin/form" element={<AdminForm />} />
                   <Route path="/admin/reservations-jour-m" element={<AdminReservationsJourM />} />
                   <Route path="/admin/system-check" element={<AdminSystemCheck />} />
                   <Route path="/admin/jeunes-maries" element={<AdminJeunesMaries />} />
                  
                  {/* Services routes */}
                  <Route path="/services/budget" element={<Budget />} />
                  
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
