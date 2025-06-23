
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import FormulaireProfessionnelsAdmin from "@/components/admin/FormulaireProfessionnelsAdmin";
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
      <div className="min-h-screen flex items-center justify-center px-4">
        {isAdmin ? (
          <div className="w-full max-w-7xl">
            <h1 className="text-2xl font-bold mb-4 text-center mt-12">Administration des Formulaires Professionnels</h1>
            <p className="text-lg text-center mb-6">
              Gérez et examinez les candidatures des professionnels depuis cette interface.
            </p>
            <FormulaireProfessionnelsAdmin />
            <Toaster />
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Accès restreint</h2>
            <p className="text-muted-foreground">
              Vous devez être connecté avec un compte administrateur pour accéder à cette page.
            </p>
          </div>
        )}
      </div>
    </AdminPasswordProtection>
  );
};

export default AdminFormulaireProfessionnels;
