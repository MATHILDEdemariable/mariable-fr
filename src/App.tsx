
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { ReaderModeProvider } from "@/contexts/ReaderModeContext";
import { BriefContextProvider } from "@/components/wedding-assistant/BriefContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
import BlogPage from "@/pages/Blog";
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
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/dashboard" element={<DashboardLayout />} />
                  
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
