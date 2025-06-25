
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
import Confidentialite from "./pages/Confidentialite";
import ConditionsGenerales from "./pages/ConditionsGenerales";
import MentionsLegales from "./pages/MentionsLegales";
import BlogCategory from "./pages/BlogCategory";
import BlogSearch from "./pages/BlogSearch";
import Prestataires from "./pages/services/Prestataires";
import Prestataire from "./pages/prestataire/slug";
import Search from "./pages/Search";
import Subscribe from "./pages/Subscribe";
import Account from "./pages/dashboard/Account";
import Billing from "./pages/dashboard/Billing";
import Notifications from "./pages/dashboard/Notifications";
import Security from "./pages/dashboard/Security";
import Error from "./pages/Error";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailConfirmation from "./pages/auth/EmailConfirmation";
import Logout from "./pages/Logout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AnalyticsProvider>
          <ReaderModeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
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
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />

                  {/* Dashboard routes */}
                  <Route path="/dashboard/account" element={<Account />} />
                  <Route path="/dashboard/billing" element={<Billing />} />
                  <Route path="/dashboard/notifications" element={<Notifications />} />
                  <Route path="/dashboard/security" element={<Security />} />

                  {/* Static routes */}
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/blog/category/:category" element={<BlogCategory />} />
		              <Route path="/blog/search/:searchTerm" element={<BlogSearch />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/confidentialite" element={<Confidentialite />} />
                  <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />

                  {/* Prestataires routes */}
                  <Route path="/prestataires" element={<Prestataires />} />
                  <Route path="/prestataires/:slug" element={<Prestataire />} />

                  {/* Search route */}
                  <Route path="/search/:searchTerm" element={<Search />} />

                  {/* Subscribe route */}
                  <Route path="/subscribe/:email" element={<Subscribe />} />

                  {/* Error route */}
                  <Route path="/error" element={<Error />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ReaderModeProvider>
        </AnalyticsProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
