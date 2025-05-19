
import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TestAssistantVirtuel from './pages/TestAssistantVirtuel';
import Index from './pages/Index';
import WeddingAssistantV2 from './pages/WeddingAssistantV2';
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
          element: <Index />,
        },
        {
          path: "/wedding-assistant-v2",
          element: <WeddingAssistantV2 />,
        },
        {
          path: "/test-assistant-virtuel",
          element: <TestAssistantVirtuel />,
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
