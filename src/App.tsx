import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Home from './pages/Home';
import Prestations from './pages/Prestations';
import Contact from './pages/Contact';
import Mariage from './pages/services/Mariage';
import Bapteme from './pages/services/Bapteme';
import Entreprise from './pages/services/Entreprise';
import Association from './pages/services/Association';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import Vendors from './pages/Vendors';
import VendorDetail from './pages/VendorDetail';
import BudgetCalculator from './pages/BudgetCalculator';
import WeddingAssistant from './pages/WeddingAssistant';
import WeddingAssistantV2 from './pages/WeddingAssistantV2';
import Planification from './pages/services/Planification';
import JourJ from './pages/services/JourJ';
import TestFormulaire from './pages/TestFormulaire';
import PlanningPersonnalise from './pages/PlanningPersonnalise';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated when the app loads
    const token = localStorage.getItem('supabase.auth.token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/prestations",
          element: <Prestations />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/services/mariage",
          element: <Mariage />,
        },
        {
          path: "/services/bapteme",
          element: <Bapteme />,
        },
         {
          path: "/services/entreprise",
          element: <Entreprise />,
        },
        {
          path: "/services/association",
          element: <Association />,
        },
        {
          path: "/blog",
          element: <Blog />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/update-password",
          element: <UpdatePassword />,
        },
        {
          path: "/prestataires",
          element: <Vendors />,
        },
        {
          path: "/prestataires/:id",
          element: <VendorDetail />,
        },
        {
          path: "/calculateur-budget",
          element: <BudgetCalculator />,
        },
        {
          path: "/assistant-virtuel",
          element: <WeddingAssistant />,
        },
        {
          path: "/wedding-assistant-v2",
          element: <WeddingAssistantV2 />,
        },
        {
          path: "/services/planification",
          element: <Planification />,
        },
        {
          path: "/services/jour-j",
          element: <JourJ />,
        },
        {
          path: "/test-formulaire",
          element: <TestFormulaire />,
        },
        {
          path: "/planning-personnalise",
          element: <PlanningPersonnalise />,
        },
      ])}
    />
  );
}

export default App;
