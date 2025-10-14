import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { HelmetProvider } from 'react-helmet-async';
import { ReaderModeProvider } from '@/contexts/ReaderModeContext';
import PaymentSuccessHandler from '@/components/premium/PaymentSuccessHandler';

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const LandingCouple = lazy(() => import("./pages/LandingCouple"));
const LandingGenerale = lazy(() => import("./pages/LandingGenerale"));
const SimpleHomePage = lazy(() => import("./pages/SimpleHomePage"));
const LandingPageV0 = lazy(() => import("./pages/LandingPageV0"));
const MoteurRecherche = lazy(() => import("./pages/MoteurRecherche"));
const PlanningPersonnalise = lazy(() => import("./pages/PlanningPersonnalise"));
const PlanningResultatsPersonnalises = lazy(() => import("./pages/PlanningResultatsPersonnalises"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ReservationJourM = lazy(() => import("./pages/ReservationJourM"));
const UserDashboard = lazy(() => import("./pages/dashboard/UserDashboard"));
const JourMVue = lazy(() => import("./pages/JourMVue"));
const PlanningPublic = lazy(() => import("./pages/PlanningPublic"));
const PlanningPublicProject = lazy(() => import("./pages/PlanningPublicProject"));
const MonJourMPlanningPage = lazy(() => import("./pages/MonJourMPlanning"));
const MonJourMEquipePage = lazy(() => import("./pages/MonJourMEquipe"));
const MonJourMDocumentsPage = lazy(() => import("./pages/MonJourMDocuments"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Paiement = lazy(() => import("./pages/Paiement"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogArticle"));
const Contact = lazy(() => import("./pages/contact/NousContacter"));
const Prix = lazy(() => import("./pages/Prix"));
const Prestataires = lazy(() => import("./pages/services/Prestataires"));
const Budget = lazy(() => import("./pages/services/Budget"));
const Prestataire = lazy(() => import("./pages/prestataire/slug"));
const EmailConfirmation = lazy(() => import("./pages/auth/EmailConfirmation"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const MessageHistoryPage = lazy(() => import("./pages/dashboard/MessageHistoryPage"));
const MonJourMConseils = lazy(() => import("./pages/MonJourMConseils"));
const MonJourMPenseBete = lazy(() => import("./pages/MonJourMPenseBete"));
const OutilsPlanningMariage = lazy(() => import("./pages/OutilsPlanningMariage"));
const CoordinationJourJ = lazy(() => import("./pages/CoordinationJourJ"));
const LandingJourJ = lazy(() => import("./pages/LandingJourJ"));
const MariageProvence = lazy(() => import("./pages/MariageProvence"));
const MariageParis = lazy(() => import("./pages/MariageParis"));
const MariageAuvergneRhoneAlpes = lazy(() => import("./pages/MariageAuvergneRhoneAlpes"));
const MariageNouvelleAquitaine = lazy(() => import("./pages/MariageNouvelleAquitaine"));
const WeddingRetroplanning = lazy(() => import("./pages/WeddingRetroplanning"));
const Professionnels = lazy(() => import("./pages/Professionnels"));
const CGV = lazy(() => import("./pages/CGV"));
const SalonDuMariage2025 = lazy(() => import("./pages/SalonDuMariage2025"));
const SalonJeuConcours = lazy(() => import("./pages/SalonJeuConcours"));
const SalonMicroTrottoir = lazy(() => import("./pages/SalonMicroTrottoir"));
const Approche = lazy(() => import("./pages/about/Approche"));
const Histoire = lazy(() => import("./pages/about/Histoire"));
const Charte = lazy(() => import("./pages/about/Charte"));
const Temoignages = lazy(() => import("./pages/about/Temoignages"));
const Comparatif = lazy(() => import("./pages/Comparatif"));
const FAQ = lazy(() => import("./pages/contact/FAQ"));
const ChecklistMariage = lazy(() => import("./pages/ChecklistMariage"));
const ChecklistPublic = lazy(() => import("./pages/ChecklistPublic"));
const ToDoListMariage = lazy(() => import("./pages/ToDoListMariage"));
const ListePreparatifMariage = lazy(() => import("./pages/ListePreparatifMariage"));
const Accompagnement = lazy(() => import("./pages/Accompagnement"));
const LivreBlanc = lazy(() => import("./pages/LivreBlanc"));
const CoordinateursMarriage = lazy(() => import("./pages/CoordinateursMarriage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminDevisProfessionnels = lazy(() => import("./pages/admin/DevisProfessionnels"));
const AdminSatisfactionUtilisateurs = lazy(() => import("./pages/admin/SatisfactionUtilisateurs"));
const EnvoiDevis = lazy(() => import("./pages/EnvoiDevis"));
const AdminPrestataires = lazy(() => import("./pages/admin/Prestataires"));
const AdminForm = lazy(() => import("./pages/admin/FormAdmin"));
const AdminReservationsJourM = lazy(() => import("./pages/admin/ReservationsJourM"));
const AdminSystemCheck = lazy(() => import("./pages/admin/SystemCheck"));
const AdminProfessionalRegistrations = lazy(() => import("./pages/admin/ProfessionalRegistrations"));
const JeunesMaries = lazy(() => import("./pages/JeunesMaries"));
const JeuneMariesInscription = lazy(() => import("./pages/JeuneMariesInscription"));
const JeuneMariesDetail = lazy(() => import("./pages/JeuneMariesDetail"));
const JeuneMariesConfirmation = lazy(() => import("./pages/JeuneMariesConfirmation"));
const AdminJeunesMaries = lazy(() => import("./pages/admin/AdminJeunesMaries"));
const CustomPages = lazy(() => import("./pages/admin/CustomPages"));
const AdminCarnetAdresses = lazy(() => import("./pages/admin/CarnetAdresses"));
const CustomPage = lazy(() => import("./pages/CustomPage"));
const PropositionPage = lazy(() => import("./pages/PropositionPage"));
const AvantJourJPublic = lazy(() => import("./pages/AvantJourJPublic"));
const ApresJourJPublic = lazy(() => import("./pages/ApresJourJPublic"));
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));
const ContentCreatorMariage = lazy(() => import("./pages/ContentCreatorMariage"));
const VibeWedding = lazy(() => import("./pages/VibeWedding"));
const FeaturesInteractive = lazy(() => import("./pages/FeaturesInteractive"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const SitemapHTML = lazy(() => import("./pages/SitemapHTML"));
const ProfessionnelsMariable = lazy(() => import("./pages/ProfessionnelsMariable"));
const RSVPPublicForm = lazy(() => import("./pages/rsvp/RSVPPublicForm"));
const AccommodationsPage = lazy(() => import("./pages/dashboard/AccommodationsPage"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-premium-warm">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive" />
  </div>
);

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
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                  <Route path="/" element={<LandingCouple />} />
                  <Route path="/landing-generale" element={<LandingGenerale />} />
                  <Route path="/simple" element={<SimpleHomePage />} />
                  <Route path="/landingpagev0" element={<LandingPageV0 />} />
                   <Route path="/moteur-recherche" element={<MoteurRecherche />} />
          <Route path="/selection" element={<ProtectedRoute><VibeWedding /></ProtectedRoute>} />
          <Route path="/mariage/:region" element={<MoteurRecherche />} />
          <Route path="/coordinateurs-mariage" element={<CoordinateursMarriage />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/planning-resultats-personnalises" element={<PlanningResultatsPersonnalises />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/retroplanning" element={<WeddingRetroplanning />} />
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
          
          {/* Route publique RSVP */}
          <Route path="/rsvp/:slug" element={<RSVPPublicForm />} />
                  
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
                  <Route path="/professionnelsmariable" element={<ProfessionnelsMariable />} />

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
                   
                   {/* Sitemap routes */}
                   <Route path="/sitemap.xml" element={<Sitemap />} />
                   <Route path="/sitemap" element={<SitemapHTML />} />
                   
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
}

export default App;
