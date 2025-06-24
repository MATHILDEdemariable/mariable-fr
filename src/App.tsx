import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ReaderModeProvider } from "@/contexts/ReaderModeContext";
import { BriefContextProvider } from "@/components/wedding-assistant/BriefContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import BlogPage from "@/pages/Blog";
import ArticlePage from "@/pages/ArticlePage";
import SearchPage from "@/pages/SearchPage";
import Dashboard from "@/pages/Dashboard";
import Planning from "@/pages/Planning";
import Budget from "@/pages/Budget";
import Prestataires from "@/pages/Prestataires";
import Coordination from "@/pages/Coordination";
import LandingPage from "@/pages/LandingPage";
import WeddingAssistant from "@/pages/WeddingAssistant";
import Admin from "@/pages/admin/Admin";
import AdminBlog from "@/pages/admin/AdminBlog";
import AdminFormulaireProfessionnels from "@/pages/admin/FormulaireProfessionnels";
import QuizPage from "@/pages/QuizPage";
import ProfilePage from "@/pages/ProfilePage";

import MonJourM from "@/pages/MonJourM";
import MonJourMPlanning from "@/pages/MonJourMPlanning";
import MonJourMEquipe from "@/pages/MonJourMEquipe";
import MonJourMDocuments from "@/pages/MonJourMDocuments";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ReaderModeProvider>
          <BriefContextProvider>
            <AnalyticsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/article/:id" element={<ArticlePage />} />
                  <Route path="/recherche" element={<SearchPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                   <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/assistant-mariage" element={<WeddingAssistant />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/blog" element={<AdminBlog />} />
                  <Route path="/admin/formulaires-professionnels" element={<AdminFormulaireProfessionnels />} />
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="planning" element={<Planning />} />
                    <Route path="budget" element={<Budget />} />
                    <Route path="prestataires" element={<Prestataires />} />
                    <Route path="coordination" element={<Coordination />} />
                  </Route>
                  
                  {/* Mon Jour-M Routes */}
                  <Route path="/mon-jour-m" element={<MonJourM />}>
                    <Route index element={<MonJourMPlanning />} />
                    <Route path="equipe" element={<MonJourMEquipe />} />
                    <Route path="documents" element={<MonJourMDocuments />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </AnalyticsProvider>
          </BriefContextProvider>
        </ReaderModeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
