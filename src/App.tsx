
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Selection from "./pages/MoteurRecherche";
import Prestataire from "./pages/prestataire/slug";
import Dashboard from "./pages/dashboard/UserDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Professionnels from "./pages/Professionnels";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogArticle";
import CGV from "./pages/CGV";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/contact/NousContacter";
import Contact from "./pages/contact/NousContacter";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrestataires from "./pages/admin/Prestataires";
import BlogAdmin from "./pages/admin/Blog";
import FormAdmin from "./pages/admin/FormAdmin";
import ReservationsJourM from "./pages/admin/ReservationsJourM";
import InscriptionsUtilisateurs from "./pages/admin/InscriptionsUtilisateurs";
import PrestataireTracking from "./pages/prestataire/tracking";
import AnalyticsProvider from "./components/analytics/AnalyticsProvider";
import { ReaderModeProvider } from "./contexts/ReaderModeContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsProvider>
        <ReaderModeProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/selection" element={<Selection />} />
                <Route path="/prestataire/:slug" element={<Prestataire />} />
                <Route path="/prestataire/tracking" element={<PrestataireTracking />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/professionnels" element={<Professionnels />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/cgv" element={<CGV />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Admin routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/prestataires" element={<AdminPrestataires />} />
                <Route path="/admin/blog" element={<BlogAdmin />} />
                <Route path="/admin/form" element={<FormAdmin />} />
                <Route path="/admin/reservations-jour-m" element={<ReservationsJourM />} />
                <Route path="/admin/inscriptions-utilisateurs" element={<InscriptionsUtilisateurs />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ReaderModeProvider>
      </AnalyticsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
