import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import PrestatairesAdmin from "@/components/admin/FormPrestataires";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import AdminAccess from "@/components/admin/AdminAccess";

type SupabaseAdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

const AdminPrestataires = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [hasSimpleAccess, setHasSimpleAccess] = useState(false);

  useEffect(() => {
    // Check simple access first
    const simpleAccess = localStorage.getItem('admin_access');
    if (simpleAccess === 'granted') {
      setHasSimpleAccess(true);
      setIsLoading(false);
      return;
    }

    // Otherwise check Supabase auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user?.id) {
        checkIfAdmin(newSession.user.id);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) {
        checkIfAdmin(session.user.id);
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .single<SupabaseAdminUser>();
      
      setIsAdmin(!error && !!data);
      setIsLoading(false);
      
      if (error || !data) {
        toast.error("Vous n'avez pas les droits administrateur");
      }
    } catch (err) {
      console.error("Erreur lors de la vérification des droits admin:", err);
      setIsAdmin(false);
      setIsLoading(false);
      toast.error("Une erreur est survenue lors de la vérification de vos droits");
    }
  };

  const handleSimpleAccessGranted = () => {
    setHasSimpleAccess(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  // Show admin access form if no access
  if (!hasSimpleAccess && !isAdmin) {
    return <AdminAccess onAccessGranted={handleSimpleAccessGranted} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center mt-12">Administration des Prestataires</h1>
            <p className="text-lg text-center mb-6">
              Gérez votre base de prestataires depuis cette interface.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/form-admin')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Questions
            </button>
            <button
              onClick={() => navigate('/admin/reservations-jour-m')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Réservations Jour M
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('admin_access');
                navigate('/');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <PrestatairesAdmin />
        <Toaster />
      </div>
    </div>
  );
};

export default AdminPrestataires;
