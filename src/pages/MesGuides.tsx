import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Download, BookOpen, ArrowRight, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { GUIDES } from '@/data/guides';

interface Purchase {
  guide_slug: string;
  email: string;
  created_at: string;
}

export default function MesGuides() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [email, setEmail] = useState<string>('');
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const { data, error } = await supabase.rpc('get_purchases_by_token', { token_value: token });
      if (error) {
        console.error(error);
        toast({ title: 'Erreur', description: 'Impossible de charger vos guides.', variant: 'destructive' });
      } else if (data && data.length > 0) {
        setPurchases(data as Purchase[]);
        setEmail((data as Purchase[])[0].email);
      }
      setLoading(false);
    };
    load();
  }, [token, toast]);

  const handleDownload = async (slug: string) => {
    if (!token) return;
    setDownloadingSlug(slug);
    try {
      const { data, error } = await supabase.functions.invoke('get-ebook-download-url', {
        body: { slug, token },
      });
      if (error || !data?.url) throw new Error(error?.message || 'URL indisponible');

      const response = await fetch(data.url);
      if (!response.ok) throw new Error('PDF indisponible');

      const pdfBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = `${slug}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      toast({ title: 'Erreur', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setDownloadingSlug(null);
    }
  };

  const purchasedGuides = GUIDES.filter((g) => purchases.some((p) => p.guide_slug === g.slug));

  return (
    <>
      <Helmet>
        <title>Mes guides Mariable</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-editorial-cream flex flex-col">
        <PremiumHeader />

        <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <p className="uppercase tracking-[0.3em] text-xs mb-4 text-editorial-olive">Mes guides</p>
            <h1 className="font-serif text-3xl md:text-5xl text-editorial-noir">
              Merci pour votre <span className="italic">achat</span>
            </h1>
            {email && (
              <p className="mt-4 text-sm text-editorial-noir/60 inline-flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {email}
              </p>
            )}
          </div>

          {loading ? (
            <p className="text-center text-editorial-noir/60 py-16">Chargement…</p>
          ) : purchasedGuides.length === 0 ? (
            <div className="text-center bg-white border border-editorial-noir/10 p-10">
              <p className="text-editorial-noir/70 mb-6">
                Aucun guide trouvé pour ce lien. Si vous venez de payer, patientez quelques secondes puis rechargez la page.
              </p>
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3 text-sm"
              >
                Retour à la bibliothèque <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchasedGuides.map((g) => (
                <div
                  key={g.slug}
                  className="bg-white border border-editorial-noir/10 p-6 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="bg-editorial-beige w-14 h-14 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-editorial-olive" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-lg text-editorial-noir">{g.title}</h2>
                    <p className="text-sm text-editorial-noir/60 mt-1">{g.description}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(g.slug)}
                    disabled={downloadingSlug === g.slug}
                    className="inline-flex items-center gap-2 bg-editorial-olive hover:bg-editorial-olive/90 text-white px-5 py-2.5 text-sm disabled:opacity-60"
                  >
                    <Download className="w-4 h-4" />
                    {downloadingSlug === g.slug ? 'Préparation…' : 'Télécharger'}
                  </button>
                </div>
              ))}

              <p className="text-center text-xs text-editorial-noir/50 mt-8">
                Gardez ce lien en favoris pour re-télécharger vos guides à tout moment.
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
