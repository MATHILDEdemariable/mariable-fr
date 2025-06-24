
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import FormulaireProfessionnelsCRM from "@/components/admin/FormulaireProfessionnelsCRM";
import AdminPasswordProtection from "@/components/admin/AdminPasswordProtection";

type SupabaseAdminUser = Database["public"]["Tables"]["admin_users"]["Row"];

const AdminFormulaireProfessionnels = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      <div className="flex justify-center items-center h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <AdminPasswordProtection>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {isAdmin ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">CRM - Gestion des Formulaires Professionnels</h1>
                <p className="text-lg text-gray-600">
                  Interface CRM complète pour gérer vos prestataires et leur cycle de vie commercial.
                </p>
              </div>
              <FormulaireProfessionnelsCRM />
            </>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center p-8 border rounded-lg shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-4">Accès restreint</h2>
                <p className="text-muted-foreground">
                  Vous devez être connecté avec un compte administrateur pour accéder à cette page.
                </p>
              </div>
            </div>
          )}
        </div>
        <Toaster />
      </div>
    </AdminPasswordProtection>
  );
};

export default AdminFormulaireProfessionnels;
