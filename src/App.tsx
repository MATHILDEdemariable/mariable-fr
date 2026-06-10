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
import { CartProvider } from '@/components/cart/CartProvider';
import { AuthProvider } from '@/contexts/AuthContext';
// Direct imports for SEO-critical pages (homepage only)
import LandingCouple from "./pages/LandingCouple";
import LandingGenerale from "./pages/LandingGenerale";

// Lazy load all other pages including regional & SEO pages (still SSR-friendly with Helmet)
const Prestataires = lazy(() => import("./pages/services/Prestataires"));
const Prestataire = lazy(() => import("./pages/prestataire/slug"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogArticle"));
const MariageProvence = lazy(() => import("./pages/MariageProvence"));
const MariageParis = lazy(() => import("./pages/MariageParis"));
const MariageAuvergneRhoneAlpes = lazy(() => import("./pages/MariageAuvergneRhoneAlpes"));
const MariageNouvelleAquitaine = lazy(() => import("./pages/MariageNouvelleAquitaine"));
const MariageBretagne = lazy(() => import("./pages/MariageBretagne"));
const MariageNormandie = lazy(() => import("./pages/MariageNormandie"));
const MariageOccitanie = lazy(() => import("./pages/MariageOccitanie"));
const MariagePaysLoire = lazy(() => import("./pages/MariagePaysLoire"));
const MariageCentreValLoire = lazy(() => import("./pages/MariageCentreValLoire"));
const MariageHautsFrance = lazy(() => import("./pages/MariageHautsFrance"));
const MariageBourgogne = lazy(() => import("./pages/MariageBourgogne"));
const MariageGrandEst = lazy(() => import("./pages/MariageGrandEst"));
const MariageCorse = lazy(() => import("./pages/MariageCorse"));
const ChecklistMariage = lazy(() => import("./pages/ChecklistMariage"));
const CoordinationJourJ = lazy(() => import("./pages/CoordinationJourJ"));

const Callback = lazy(() => import("./pages/auth/Callback"));

// Lazy load all other pages
const Index = lazy(() => import("./pages/Index"));
const VersionJuin26 = lazy(() => import("./pages/VersionJuin26"));
const MediaKit = lazy(() => import("./pages/MediaKit"));
const GuidesShop = lazy(() => import("./pages/GuidesShop"));
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
const Contact = lazy(() => import("./pages/contact/NousContacter"));
const Prix = lazy(() => import("./pages/Prix"));
const Budget = lazy(() => import("./pages/services/Budget"));
const EmailConfirmation = lazy(() => import("./pages/auth/EmailConfirmation"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const MonJourMConseils = lazy(() => import("./pages/MonJourMConseils"));
const MonJourMPenseBete = lazy(() => import("./pages/MonJourMPenseBete"));
const OutilsPlanningMariage = lazy(() => import("./pages/OutilsPlanningMariage"));
const LandingJourJ = lazy(() => import("./pages/LandingJourJ"));
const WeddingRetroplanning = lazy(() => import("./pages/WeddingRetroplanning"));
const Partenariat = lazy(() => import("./pages/Partenariat"));
const Agence = lazy(() => import("./pages/Agence"));
const CGV = lazy(() => import("./pages/CGV"));
const SalonJeuConcours = lazy(() => import("./pages/SalonJeuConcours"));
const Approche = lazy(() => import("./pages/about/Approche"));
const Histoire = lazy(() => import("./pages/about/Histoire"));
const Charte = lazy(() => import("./pages/about/Charte"));
const Temoignages = lazy(() => import("./pages/about/Temoignages"));
const Comparatif = lazy(() => import("./pages/Comparatif"));
const FAQ = lazy(() => import("./pages/contact/FAQ"));
const ChecklistPublic = lazy(() => import("./pages/ChecklistPublic"));
const ToDoListMariage = lazy(() => import("./pages/ToDoListMariage"));
const ListePreparatifMariage = lazy(() => import("./pages/ListePreparatifMariage"));

const LivreBlanc = lazy(() => import("./pages/LivreBlanc"));
const NewsletterEmbed = lazy(() => import("./pages/NewsletterEmbed"));
const CoordinateursMarriage = lazy(() => import("./pages/CoordinateursMarriage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlog = lazy(() => import("./pages/admin/Blog"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminDevisProfessionnels = lazy(() => import("./pages/admin/DevisProfessionnels"));
const AdminSatisfactionUtilisateurs = lazy(() => import("./pages/admin/SatisfactionUtilisateurs"));
const AdminUsageStats = lazy(() => import("./pages/admin/UsageStats"));
const AdminUserAnalysis = lazy(() => import("./pages/admin/UserAnalysis"));
const EnvoiDevis = lazy(() => import("./pages/EnvoiDevis"));
const AdminPrestataires = lazy(() => import("./pages/admin/Prestataires"));
const AdminForm = lazy(() => import("./pages/admin/FormAdmin"));
const AdminReservationsJourM = lazy(() => import("./pages/admin/ReservationsJourM"));
const AdminSystemCheck = lazy(() => import("./pages/admin/SystemCheck"));
const AdminMaintenance = lazy(() => import("./pages/admin/Maintenance"));
const AdminProfessionalRegistrations = lazy(() => import("./pages/admin/ProfessionalRegistrations"));
const AdminPaymentLeads = lazy(() => import("./pages/admin/PaymentLeads"));
const AdminPartenariats = lazy(() => import("./pages/admin/Partenariats"));
const JeunesMaries = lazy(() => import("./pages/JeunesMaries"));
const JeuneMariesInscription = lazy(() => import("./pages/JeuneMariesInscription"));
const JeuneMariesDetail = lazy(() => import("./pages/JeuneMariesDetail"));
const JeuneMariesConfirmation = lazy(() => import("./pages/JeuneMariesConfirmation"));
const AdminJeunesMaries = lazy(() => import("./pages/admin/AdminJeunesMaries"));
const CustomPages = lazy(() => import("./pages/admin/CustomPages"));
const AdminCarnetAdresses = lazy(() => import("./pages/admin/CarnetAdresses"));
const AdminContactRequests = lazy(() => import("./pages/admin/ContactRequests"));
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
const QRCodeGeneratorPage = lazy(() => import("./pages/dashboard/QRCodeGenerator"));
const SeatingPlan = lazy(() => import("./pages/SeatingPlan"));
const ProDashboardMockup = lazy(() => import("./pages/pro/ProDashboardMockup"));
const GuideDuJourJ = lazy(() => import("./pages/GuideDuJourJ"));
const GuideDebutant = lazy(() => import("./pages/GuideDebutant"));
const CGVCouples = lazy(() => import("./pages/CGVCouples"));
const AccueilClubMariable = lazy(() => import("./pages/AccueilClubMariable"));
const AccueilProfessionnels = lazy(() => import("./pages/AccueilProfessionnels"));
const DomaineDeLaFontaine = lazy(() => import("./pages/DomaineDeLaFontaine"));
const DomaineDeBadine = lazy(() => import("./pages/DomaineDeBadine"));
const Mariable = lazy(() => import("./pages/Mariable"));
const MariableAmbassadeur = lazy(() => import("./pages/MariableAmbassadeur"));
const MariablePartenaire = lazy(() => import("./pages/MariablePartenaire"));
const CeremoniePublic = lazy(() => import("./pages/CeremoniePublic"));
const InstallAppPublic = lazy(() => import("./pages/InstallAppPublic"));
const MairieCivilPublic = lazy(() => import("./pages/MairieCivilPublic"));
const CeremonieCatholiquePublic = lazy(() => import("./pages/CeremonieCatholiquePublic"));
const WeddingSeverineOlivier = lazy(() => import("./pages/WeddingSeverineOlivier"));
const ExempleSite = lazy(() => import("./pages/ExempleSite"));

// Loading component with accessibility improvements
const PageLoader = () => (
  <div 
    className="min-h-screen flex items-center justify-center bg-premium-warm" 
    role="status" 
    aria-label="Chargement du contenu"
  >
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive" aria-hidden="true" />
    <span className="sr-only">Chargement en cours...</span>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,         // 5 minutes - évite les refetch inutiles
      gcTime: 10 * 60 * 1000,           // 10 minutes - garde en cache plus longtemps
      refetchOnWindowFocus: false,      // Éviter refetch à chaque focus de fenêtre
      refetchOnReconnect: false,        // Éviter refetch à chaque reconnexion
      retry: 1,                          // Max 1 retry au lieu de 3 par défaut
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <ReaderModeProvider>
            <CartProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnalyticsProvider>
                  <PaymentSuccessHandler />
                  <Suspense fallback={<PageLoader />}>
                  <Routes>
                  <Route path="/" element={<VersionJuin26 />} />
                  <Route path="/accueil" element={<LandingCouple />} />
                  <Route path="/versionjuin26" element={<Navigate to="/" replace />} />
                  <Route path="/guides" element={<GuidesShop />} />
                  <Route path="/media-kit" element={<MediaKit />} />
                  <Route path="/kitmedia" element={<MediaKit />} />
                  <Route path="/KITMEDIA" element={<MediaKit />} />
                  <Route path="/mariable" element={<Mariable />} />
                  <Route path="/mariable-v1" element={<Mariable />} />
                  <Route path="/landing-generale" element={<LandingGenerale />} />
                  <Route path="/accueilclubmariable" element={<AccueilClubMariable />} />
                  <Route path="/accueilprofessionnels" element={<AccueilProfessionnels />} />
                  <Route path="/domainedelafontaine" element={<DomaineDeLaFontaine />} />
                  <Route path="/domainedelabadine" element={<DomaineDeBadine />} />
                  <Route path="/mariable.ambassadeur" element={<MariableAmbassadeur />} />
                  <Route path="/mariable.partenaire" element={<MariablePartenaire />} />
                   
          <Route path="/selection" element={<ProtectedRoute><VibeWedding /></ProtectedRoute>} />
          <Route path="/mariage/:region" element={<MoteurRecherche />} />
          <Route path="/coordinateurs-mariage" element={<CoordinateursMarriage />} />
                  <Route path="/planning-personnalise" element={<PlanningPersonnalise />} />
                  <Route path="/planning-resultats-personnalises" element={<PlanningResultatsPersonnalises />} />
                  <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                  <Route path="/retroplanning" element={<WeddingRetroplanning />} />
                  <Route path="/installer-app" element={<InstallAppPublic />} />
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
          <Route path="/mariage-bretagne" element={<MariageBretagne />} />
          <Route path="/mariage-normandie" element={<MariageNormandie />} />
          <Route path="/mariage-occitanie" element={<MariageOccitanie />} />
          <Route path="/mariage-pays-de-la-loire" element={<MariagePaysLoire />} />
          <Route path="/mariage-centre-val-de-loire" element={<MariageCentreValLoire />} />
          <Route path="/mariage-hauts-de-france" element={<MariageHautsFrance />} />
          <Route path="/mariage-bourgogne-franche-comte" element={<MariageBourgogne />} />
          <Route path="/mariage-grand-est" element={<MariageGrandEst />} />
          <Route path="/mariage-corse" element={<MariageCorse />} />
                  
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
                   <Route path="/register" element={<Paiement />} />
                   <Route path="/register-gratuit" element={<Register />} />
                   <Route path="/inscription-gratuite" element={<Navigate to="/register-gratuit" replace />} />
                   <Route path="/auth" element={<Login />} />
                   <Route path="/auth/callback" element={<Callback />} />
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
                  <Route path="/professionnels" element={<Navigate to="/partenariat" replace />} />
                  <Route path="/partenariat" element={<Partenariat />} />
                  <Route path="/agence" element={<Agence />} />
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/cgv-couples" element={<CGVCouples />} />
                  <Route path="/ceremonie-laique" element={<CeremoniePublic />} />
                  <Route path="/mariage-civil" element={<MairieCivilPublic />} />
                  <Route path="/ceremonie-catholique" element={<CeremonieCatholiquePublic />} />
                  <Route path="/severine-et-olivier" element={<WeddingSeverineOlivier />} />
                  <Route path="/exemplesite" element={<ExempleSite />} />
                  
                  {/* Dashboard Professionnel Mockup */}
                  <Route path="/pro/dashboard" element={<ProDashboardMockup />} />
                  
                  <Route path="/contact/faq" element={<FAQ />} />
                   <Route path="/checklist-mariage" element={<ChecklistMariage />} />
                   <Route path="/checklist-public/:userId" element={<ChecklistPublic />} />
                   <Route path="/to-do-list-mariage" element={<ToDoListMariage />} />
                  <Route path="/liste-preparatif-mariage" element={<ListePreparatifMariage />} />
                   
                   <Route path="/guidecoordinationjour-j" element={<LivreBlanc />} />
                   <Route path="/guidepersonnalise" element={<NewsletterEmbed />} />
                   <Route path="/guide-jour-j" element={<GuideDuJourJ />} />
                   <Route path="/guide-debutant" element={<GuideDebutant />} />

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
                   <Route path="/admin/usage-stats" element={<AdminUsageStats />} />
                   <Route path="/admin/user-analysis" element={<AdminUserAnalysis />} />
                   <Route path="/envoidevis" element={<EnvoiDevis />} />
                   <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                   <Route path="/admin/professional-registrations" element={<AdminProfessionalRegistrations />} />
                   <Route path="/admin/payment-leads" element={<AdminPaymentLeads />} />
                   <Route path="/admin/partenariats" element={<AdminPartenariats />} />
                   <Route path="/admin/form" element={<AdminForm />} />
                   <Route path="/admin/reservations-jour-m" element={<AdminReservationsJourM />} />
                   <Route path="/admin/system-check" element={<AdminSystemCheck />} />
                   <Route path="/admin/maintenance" element={<AdminMaintenance />} />
                    <Route path="/admin/jeunes-maries" element={<AdminJeunesMaries />} />
                    <Route path="/admin/custom-pages" element={<CustomPages />} />
                    <Route path="/admin/carnet-adresses" element={<AdminCarnetAdresses />} />
                    <Route path="/admin/contact" element={<AdminContactRequests />} />
                   
                    {/* Custom pages route */}
                   <Route path="/custom/:slug" element={<CustomPage />} />
                   
                   {/* Proposition pages route */}
                   <Route path="/proposition/:slug" element={<PropositionPage />} />
                   
                   {/* Services routes */}
                   <Route path="/services/budget" element={<Budget />} />
                   
                   {/* Salon du Mariage 2025 routes */}
                   <Route path="/salon-du-mariage-2025/jeu-concours" element={<SalonJeuConcours />} />
                   
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
        </CartProvider>
      </ReaderModeProvider>
    </AuthProvider>
  </HelmetProvider>
</QueryClientProvider>
);
}

export default App;
