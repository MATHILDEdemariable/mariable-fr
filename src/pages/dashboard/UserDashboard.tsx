
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectSummary from '@/components/dashboard/ProjectSummary';
import PrestairesList from '@/components/dashboard/VendorTracking';
import TasksList from '@/components/dashboard/TasksList';
import CoordinationPage from './CoordinationPage';
import WishlistPage from './WishlistPage';
import BudgetPage from './BudgetPage';
import { useToast } from '@/components/ui/use-toast';
import DrinksCalculator from '@/components/drinks/DrinksCalculator';
import VendorTrackingPage from './VendorTrackingPage';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
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
  }, [navigate, location.pathname, toast]);

  return (
    <>
      <Helmet>
        <title>Dashboard | Mariable</title>
        <meta name="description" content="Tableau de bord utilisateur Mariable" />
      </Helmet>

      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<ProjectSummary />} />
          <Route path="tasks" element={<TasksList />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="prestataires" element={<PrestairesList />} />
          <Route path="vendor-tracking" element={<VendorTrackingPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="coordination" element={<CoordinationPage />} />
          <Route path="drinks" element={<DrinksCalculator />} />
          <Route path="settings" element={<div>Paramètres</div>} />
          <Route path="*" element={<div>Page non trouvée</div>} />
        </Route>
      </Routes>
    </>
  );
};

export default UserDashboard;
