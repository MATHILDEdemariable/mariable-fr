
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import PrestatairesAdmin from "@/components/admin/FormPrestataires";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import AdminLayout from "@/components/admin/AdminLayout";

type SupabaseAdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

const AdminPrestataires = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    if (adminAuth !== 'true') {
      navigate('/admin/dashboard');
      return;
    }

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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-wedding-black">CRM Prestataires</h1>
          <p className="text-gray-600 mt-2">
            Gérez votre base de prestataires depuis cette interface.
          </p>
        </div>
        
        {isAdmin ? (
          <PrestatairesAdmin />
        ) : (
          <div className="text-center p-8 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Accès restreint</h2>
            <p className="text-muted-foreground">
              Vous devez être connecté avec un compte administrateur pour accéder à cette page.
            </p>
          </div>
        )}
        
        <Toaster />
      </div>
    </AdminLayout>
  );
};

export default AdminPrestataires;
