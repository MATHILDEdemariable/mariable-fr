import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Lien imprimé sur les QR codes traçables : compte le scan puis redirige.
const QrRedirect = () => {
  const { slug } = useParams();

  useEffect(() => {
    const redirectAfterScan = async () => {
      let targetUrl = '/';
      try {
        const { data, error } = await supabase.rpc('record_immersion_qr_scan' as never, { slug_value: slug } as never);
        if (error) throw error;
        if (typeof data === 'string' && data) targetUrl = data;
      } catch (error) {
        console.error('❌ record_immersion_qr_scan failed:', error);
        if (slug === 'immersion-mariage') targetUrl = '/immersion-mariage?source=qr';
      }
      window.location.replace(targetUrl);
    };
    redirectAfterScan();
  }, [slug]);

  return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">Redirection…</div>;
};

export default QrRedirect;
