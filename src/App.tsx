
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { ReaderModeProvider } from "@/contexts/ReaderModeContext";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import DashboardPage from "./pages/dashboard/UserDashboard";
import PublicDashboardPage from "./pages/dashboard/ReaderView";
import LegalPage from "./pages/MentionsLegales";
import PricingPage from "./pages/Pricing";
import AuthCallbackPage from "./pages/auth/Callback";
import NotFoundPage from "./pages/NotFound";
import MonJourMPlanningPage from "./pages/MonJourMPlanning";

import MonJourMSharedPage from "@/pages/MonJourMShared";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsProvider>
        <HelmetProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <TooltipProvider>
              <ReaderModeProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/dashboard/lecteur/:token" element={<PublicDashboardPage />} />
                    <Route path="/legal" element={<LegalPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/auth-callback" element={<AuthCallbackPage />} />
                    <Route path="*" element={<NotFoundPage />} />
										<Route path="/mon-jour-m" element={<MonJourMPlanningPage />} />
                    <Route path="/planning/shared/:token" element={<MonJourMSharedPage />} />
                  </Routes>
                </BrowserRouter>
              </ReaderModeProvider>
            </TooltipProvider>
          </ThemeProvider>
        </HelmetProvider>
      </AnalyticsProvider>
    </QueryClientProvider>
  );
}

export default App;
