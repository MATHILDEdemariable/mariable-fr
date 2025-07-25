
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import VendorTracking from '@/components/dashboard/VendorTracking';
import ChecklistPage from './ChecklistPage';
import CoordinationPage from './CoordinationPage';
import WishlistPage from './WishlistPage';
import BudgetPage from './BudgetPage';
import PlanningPage from './PlanningPage';
import DetailedBudget from '@/components/dashboard/DetailedBudget';
import UserProfile from '@/components/dashboard/UserProfile';
import AssistantPage from './AssistantPage';
import { useToast } from '@/components/ui/use-toast';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';
import BudgetCalculator from '@/components/dashboard/BudgetCalculator';
import { useReaderMode } from '@/contexts/ReaderModeContext';
import ProjectManagement from '@/components/project-management/ProjectManagement';
import HelpPage from './HelpPage';
import PremiumBadge from '@/components/premium/PremiumBadge';
import MessageHistoryPage from './MessageHistoryPage';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isReaderMode, shareToken } = useReaderMode();

  useEffect(() => {
    // If in reader mode, skip authentication check
    if (isReaderMode && shareToken) return;
    
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté pour accéder à votre tableau de bord",
          variant: "destructive"
        });
        navigate('/login', { state: { from: location.pathname } });
      }
    };

    checkAuth();
  }, [navigate, location.pathname, toast, isReaderMode, shareToken]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Mariable</title>
        <meta name="description" content="Tableau de bord utilisateur Mariable" />
      </Helmet>

      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<ProjectSummary />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="tasks" element={<ChecklistPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="budget/detailed" element={<DetailedBudget />} />
          <Route path="budget/calculator" element={<BudgetCalculator />} />
          <Route path="prestataires" element={<VendorTracking />} />
          <Route path="message-history" element={<MessageHistoryPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="coordination" element={<CoordinationPage />} />
          <Route path="drinks" element={<DrinksCalculator />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="project-management/*" element={<ProjectManagement />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="settings" element={<UserProfile />} />
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Route>
      </Routes>
    </>
  );
};

export default UserDashboard;
