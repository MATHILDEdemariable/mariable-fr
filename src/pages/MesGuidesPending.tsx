import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';

export default function MesGuidesPending() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get('session_id');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Session introuvable.');
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20; // ~40 s

    const poll = async () => {
      attempts++;
      const { data, error: rpcError } = await supabase.rpc('get_token_by_session', {
        session_id_value: sessionId,
      });

      if (cancelled) return;

      if (rpcError) {
        console.error(rpcError);
      }

      if (data) {
        navigate(`/mes-guides/${data}`, { replace: true });
        return;
      }

      if (attempts >= maxAttempts) {
        setError(
          "Votre paiement est bien reçu, mais la livraison prend plus de temps que prévu. Vérifiez votre email dans quelques minutes."
        );
        return;
      }

      setTimeout(poll, 2000);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  return (
    <>
      <Helmet>
        <title>Traitement de votre commande…</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-editorial-cream flex flex-col">
        <PremiumHeader />
        <main className="flex-grow container mx-auto px-6 py-24 max-w-lg text-center">
          {error ? (
            <>
              <h1 className="font-serif text-2xl text-editorial-noir mb-4">Livraison en cours</h1>
              <p className="text-editorial-noir/70 mb-8">{error}</p>
              <Link
                to="/guides"
                className="inline-block border border-editorial-noir px-6 py-3 text-sm hover:bg-editorial-noir hover:text-white"
              >
                Retour aux guides
              </Link>
            </>
          ) : (
            <>
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-editorial-olive mb-6" />
              <h1 className="font-serif text-2xl text-editorial-noir mb-3">
                Merci ! On prépare votre guide…
              </h1>
              <p className="text-editorial-noir/70 text-sm">
                Votre paiement est confirmé. Vous allez être redirigé vers votre guide dans quelques secondes.
              </p>
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
