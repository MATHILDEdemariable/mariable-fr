
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";
import { ReaderModeProvider } from "./contexts/ReaderModeContext";
import Index from "./pages/Index";
import Contact from "./pages/contact/NousContacter";
import Coordination from "./pages/services/Planification";
import Legal from "./pages/MentionsLegales";
import Mariage from "./pages/services/Prestataires";
import Mentions from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";
import Politique from "./pages/CGV";
import Prestations from "./pages/services/Prestataires";
import Reservation from "./pages/ReservationJourM";
import ReservationJourM from "./pages/ReservationJourM";
import Team from "./pages/about/Histoire";
import Valeurs from "./pages/about/Charte";
import Admin from "./pages/admin/FormAdmin";
import JourMReservations from "./pages/admin/JourMReservations";

const queryClient = new QueryClient();

const App = () => (
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
                <Route path="/contact" element={<Contact />} />
                <Route path="/coordination" element={<Coordination />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/mariage" element={<Mariage />} />
                <Route path="/mentions" element={<Mentions />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/politique" element={<Politique />} />
                <Route path="/prestations" element={<Prestations />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/reservation-jour-m" element={<ReservationJourM />} />
                <Route path="/team" element={<Team />} />
                <Route path="/valeurs" element={<Valeurs />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/jour-m" element={<JourMReservations />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ReaderModeProvider>
      </AnalyticsProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
