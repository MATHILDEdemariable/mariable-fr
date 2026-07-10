import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Local typed wrapper for the beta supabase.auth.oauth namespace so TS is happy.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function oauthApi(): OAuthApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.auth as any).oauth as OAuthApi;
}

function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Paramètre authorization_id manquant");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      try {
        const { data, error } = await oauthApi().getAuthorizationDetails(
          authorizationId,
        );
        if (!active) return;
        if (error) {
          setError(error.message);
          return;
        }
        const immediate = data?.redirect_url ?? data?.redirect_to;
        if (immediate && !data?.client) {
          window.location.href = immediate;
          return;
        }
        setDetails(data);
      } catch (e: any) {
        setError(e?.message ?? "Erreur lors du chargement");
      }
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    try {
      const api = oauthApi();
      const { data, error } = approve
        ? await api.approveAuthorization(authorizationId)
        : await api.denyAuthorization(authorizationId);
      if (error) {
        setBusy(false);
        setError(error.message);
        return;
      }
      const target = data?.redirect_url ?? data?.redirect_to;
      if (!target) {
        setBusy(false);
        setError("Aucune redirection retournée par le serveur d'autorisation.");
        return;
      }
      window.location.href = target;
    } catch (e: any) {
      setBusy(false);
      setError(e?.message ?? "Erreur");
    }
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-premium-warm">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="font-serif">Autorisation impossible</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-muted-foreground">Chargement…</p>
      </main>
    );
  }

  const clientName = details?.client?.name ?? "cette application";

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-premium-warm">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">
            Connecter {clientName} à Mariable
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <strong>{clientName}</strong> demande l'accès à votre compte Mariable
            pour utiliser les outils suivants en votre nom (rechercher des
            prestataires, lire votre profil et vos projets de mariage).
          </p>
          <p className="text-xs text-muted-foreground">
            L'application n'aura accès qu'aux données auxquelles vous avez déjà
            accès. Vous pouvez révoquer cet accès à tout moment.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => decide(true)}
              disabled={busy}
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/80"
            >
              {busy ? "…" : "Autoriser"}
            </Button>
            <Button
              onClick={() => decide(false)}
              disabled={busy}
              variant="outline"
              className="flex-1"
            >
              Refuser
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export { safeNext };
