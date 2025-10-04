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
import LandingCouple from "./pages/LandingCouple";
import LandingGenerale from "./pages/LandingGenerale";
import SimpleHomePage from "./pages/SimpleHomePage";
import LandingPageV0 from "./pages/LandingPageV0";
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
import Prix from "./pages/Prix";
import Prestataires from "./pages/services/Prestataires";
import Budget from "./pages/services/Budget";
import Prestataire from "./pages/prestataire/slug";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import ResetPassword from "./pages/auth/ResetPassword";
import MessageHistoryPage from "./pages/dashboard/MessageHistoryPage";
import MonJourMConseils from "./pages/MonJourMConseils";
import MonJourMPenseBete from "./pages/MonJourMPenseBete";
import OutilsPlanningMariage from "./pages/OutilsPlanningMariage";
import CoordinationJourJ from "./pages/CoordinationJourJ";
import LandingJourJ from "./pages/LandingJourJ";
import MariageProvence from "./pages/MariageProvence";
import MariageParis from "./pages/MariageParis";
import MariageAuvergneRhoneAlpes from "./pages/MariageAuvergneRhoneAlpes";
import MariageNouvelleAquitaine from "./pages/MariageNouvelleAquitaine";

// Import missing pages
import Professionnels from "./pages/Professionnels";
import CGV from "./pages/CGV";
import SalonDuMariage2025 from "./pages/SalonDuMariage2025";
import SalonJeuConcours from "./pages/SalonJeuConcours";
import SalonMicroTrottoir from "./pages/SalonMicroTrottoir";
import Approche from "./pages/about/Approche";
import Histoire from "./pages/about/Histoire";
import Charte from "./pages/about/Charte";
import Temoignages from "./pages/about/Temoignages";
import Comparatif from "./pages/Comparatif";

import FAQ from "./pages/contact/FAQ";
import ChecklistMariage from "./pages/ChecklistMariage";
import ChecklistPublic from "./pages/ChecklistPublic";
import ToDoListMariage from "./pages/ToDoListMariage";
import ListePreparatifMariage from "./pages/ListePreparatifMariage";
import Accompagnement from "./pages/Accompagnement";
import LivreBlanc from "./pages/LivreBlanc";
import CoordinateursMarriage from "./pages/CoordinateursMarriage";

// Import admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/Blog";
import AdminUsers from "./pages/admin/Users";
import AdminDevisProfessionnels from "./pages/admin/DevisProfessionnels";
import AdminSatisfactionUtilisateurs from "./pages/admin/SatisfactionUtilisateurs";
import EnvoiDevis from "./pages/EnvoiDevis";
import AdminPrestataires from "./pages/admin/Prestataires";
import AdminForm from "./pages/admin/FormAdmin";
import AdminReservationsJourM from "./pages/admin/ReservationsJourM";
import AdminSystemCheck from "./pages/admin/SystemCheck";
import AdminProfessionalRegistrations from "./pages/admin/ProfessionalRegistrations";

// Import Jeunes Mariés pages
import JeunesMaries from "./pages/JeunesMaries";
import JeuneMariesInscription from "./pages/JeuneMariesInscription";
import JeuneMariesDetail from "./pages/JeuneMariesDetail";
import JeuneMariesConfirmation from "./pages/JeuneMariesConfirmation";
import AdminJeunesMaries from "./pages/admin/AdminJeunesMaries";
import CustomPages from "./pages/admin/CustomPages";
import AdminCarnetAdresses from "./pages/admin/CarnetAdresses";
import CustomPage from "./pages/CustomPage";
import PropositionPage from "./pages/PropositionPage";
import AvantJourJPublic from "./pages/AvantJourJPublic";
import ApresJourJPublic from "./pages/ApresJourJPublic";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ContentCreatorMariage from "./pages/ContentCreatorMariage";
import VibeWedding from "./pages/VibeWedding";
import FeaturesInteractive from "./pages/FeaturesInteractive";

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
                  <Route path="/" element={<LandingCouple />} />
                  <Route path="/landing-generale" element={<LandingGenerale />} />
                  <Route path="/simple" element={<SimpleHomePage />} />
                  <Route path="/landingpagev0" element={<LandingPageV0 />} />
                   <Route path="/moteur-recherche" element={<MoteurRecherche />} />
          <Route path="/selection" element={<ProtectedRoute><MoteurRecherche /></ProtectedRoute>} />
          <Route path="/mariage/:region" element={<MoteurRecherche />} />
          <Route path="/coordinateurs-mariage" element={<CoordinateursMarriage />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/planning-resultats-personnalises" element={<PlanningResultatsPersonnalises />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                   <Route path="/dashboard/*" element={<UserDashboard />} />
                   <Route path="/jour-m-vue/:token" element={<JourMVue />} />
                   
                   {/* Nouvelles pages outils */}
          <Route path="/outils-planning-mariage" element={<OutilsPlanningMariage />} />
                    <Route path="/coordination-jour-j" element={<CoordinationJourJ />} />
                    <Route path="/landingjourj" element={<LandingJourJ />} />
          
          {/* Pages régionales */}
          <Route path="/mariage-provence" element={<MariageProvence />} />
          <Route path="/mariage-paris" element={<MariageParis />} />
          <Route path="/mariage-auvergne-rhone-alpes" element={<MariageAuvergneRhoneAlpes />} />
          <Route path="/mariage-nouvelle-aquitaine" element={<MariageNouvelleAquitaine />} />
                  
                  {/* Routes publiques pour les plannings */}
                  <Route path="/planning-public/:coordinationId" element={<PlanningPublic />} />
                  <Route path="/planning-public/project/:token" element={<PlanningPublicProject />} />
          <Route path="/avant-jour-j-public/:token" element={<AvantJourJPublic />} />
          <Route path="/apres-jour-j-public/:token" element={<ApresJourJPublic />} />
                  
                  {/* Mon Jour J routes */}
                  <Route path="/mon-jour-m" element={<Navigate to="/mon-jour-m/planning" replace />} />
                  <Route path="/mon-jour-m/planning" element={<MonJourMPlanningPage />} />
                  <Route path="/mon-jour-m/equipe" element={<MonJourMEquipePage />} />
                  <Route path="/mon-jour-m/documents" element={<MonJourMDocumentsPage />} />
          <Route path="/mon-jour-m/conseils" element={<MonJourMConseils />} />
          <Route path="/mon-jour-m/pense-bete" element={<MonJourMPenseBete />} />

                  {/* Auth routes */}
                   <Route path="/login" element={<Login />} />
                   <Route path="/register" element={<Register />} />
                   <Route path="/auth" element={<Login />} />
                   <Route path="/auth/callback" element={<Navigate to="/login" replace />} />
                   <Route path="/auth/reset-password" element={<ResetPassword />} />
                   <Route path="/email-confirmation" element={<EmailConfirmation />} />
                   <Route path="/auth/email-confirmation" element={<Navigate to="/email-confirmation" replace />} />

                  {/* Static routes */}
                  <Route path="/detail-coordination-jourm" element={<Pricing />} />
                  <Route path="/prix" element={<Prix />} />
                  <Route path="/paiement" element={<Paiement />} />
                  <Route path="/conseilsmariage" element={<Blog />} />
                  <Route path="/conseilsmariage/:slug" element={<BlogPost />} />
                  {/* Redirection de l'ancienne route /blog vers /conseilsmariage */}
                  <Route path="/blog" element={<Navigate to="/conseilsmariage" replace />} />
                  <Route path="/blog/:slug" element={<Navigate to="/conseilsmariage" replace />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Missing routes - Fixed */}
                  <Route path="/professionnels" element={<Professionnels />} />
                  <Route path="/cgv" element={<CGV />} />
                  
                  <Route path="/contact/faq" element={<FAQ />} />
                   <Route path="/checklist-mariage" element={<ChecklistMariage />} />
                   <Route path="/checklist-public/:userId" element={<ChecklistPublic />} />
                   <Route path="/to-do-list-mariage" element={<ToDoListMariage />} />
                  <Route path="/liste-preparatif-mariage" element={<ListePreparatifMariage />} />
                  <Route path="/accompagnement" element={<Accompagnement />} />
                  <Route path="/guidecoordinationjour-j" element={<LivreBlanc />} />

                   {/* À propos routes - Fixed */}
                   <Route path="/about/approche" element={<Approche />} />
                   <Route path="/about/histoire" element={<Histoire />} />
                   <Route path="/about/charte" element={<Charte />} />
                   <Route path="/about/temoignages" element={<Temoignages />} />
                   <Route path="/comparatif" element={<Comparatif />} />

                   {/* Jeunes Mariés routes */}
                   <Route path="/jeunes-maries" element={<JeunesMaries />} />
                   <Route path="/jeunes-maries/inscription" element={<JeuneMariesInscription />} />
                   <Route path="/jeunes-maries/confirmation" element={<JeuneMariesConfirmation />} />
                   <Route path="/jeunes-maries/:slug" element={<JeuneMariesDetail />} />

                  {/* Prestataires routes */}
                  <Route path="/prestataires" element={<Prestataires />} />
                  <Route path="/prestataires/:slug" element={<Prestataire />} />
                  <Route path="/prestataire/:slug" element={<Prestataire />} />

                   {/* Admin routes */}
                   <Route path="/admin/dashboard" element={<AdminDashboard />} />
                   <Route path="/admin/blog" element={<AdminBlog />} />
                   <Route path="/admin/users" element={<AdminUsers />} />
                   <Route path="/admin/devis" element={<AdminDevisProfessionnels />} />
                   <Route path="/admin/satisfaction" element={<AdminSatisfactionUtilisateurs />} />
                   <Route path="/envoidevis" element={<EnvoiDevis />} />
                   <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                   <Route path="/admin/professional-registrations" element={<AdminProfessionalRegistrations />} />
                   <Route path="/admin/form" element={<AdminForm />} />
                   <Route path="/admin/reservations-jour-m" element={<AdminReservationsJourM />} />
                   <Route path="/admin/system-check" element={<AdminSystemCheck />} />
                    <Route path="/admin/jeunes-maries" element={<AdminJeunesMaries />} />
                    <Route path="/admin/custom-pages" element={<CustomPages />} />
                    <Route path="/admin/carnet-adresses" element={<AdminCarnetAdresses />} />
                   
                    {/* Custom pages route */}
                   <Route path="/custom/:slug" element={<CustomPage />} />
                   
                   {/* Proposition pages route */}
                   <Route path="/proposition/:slug" element={<PropositionPage />} />
                   
                   {/* Services routes */}
                   <Route path="/services/budget" element={<Budget />} />
                   
                   {/* Salon du Mariage 2025 routes */}
                   <Route path="/salon-du-mariage-2025" element={<SalonDuMariage2025 />} />
                   <Route path="/salon-du-mariage-2025/jeu-concours" element={<SalonJeuConcours />} />
                   <Route path="/salon-du-mariage-2025/autorisation-micro-trottoir" element={<SalonMicroTrottoir />} />
                   
                   {/* Content Creator Mariage route */}
                   <Route path="/content-creator-mariage" element={<ContentCreatorMariage />} />
                   
                   {/* Vibe Wedding route */}
                   <Route path="/vibewedding" element={<VibeWedding />} />
                   
                   {/* Features Interactive route */}
                   <Route path="/fonctionnalites" element={<FeaturesInteractive />} />
                   
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
