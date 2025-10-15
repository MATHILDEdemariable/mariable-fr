import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

interface QRCodeData {
  id: string;
  title: string;
  url: string;
  qr_code_data: string;
  created_at: string;
}

export const useQRCodes = () => {
  const [qrCodes, setQRCodes] = useState<QRCodeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQRCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQRCodes(data || []);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createQRCode = async (title: string, url: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#7F9474',
        light: '#FFFFFF',
      },
    });

    const { error } = await supabase.from('qr_codes').insert({
      user_id: user.id,
      title,
      url,
      qr_code_data: qrCodeDataUrl,
    });

    if (error) throw error;
    await fetchQRCodes();
  };

  const deleteQRCode = async (id: string) => {
    const { error } = await supabase.from('qr_codes').delete().eq('id', id);
    if (error) throw error;
    await fetchQRCodes();
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  return {
    qrCodes,
    isLoading,
    createQRCode,
    deleteQRCode,
  };
};
