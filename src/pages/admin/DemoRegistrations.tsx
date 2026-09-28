import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';

type DemoRegistration = { id: string; full_name: string; email: string; job_title: string; created_at: string };

const DemoRegistrations = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [registrations, setRegistrations] = useState<DemoRegistration[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const { data, error } = await (supabase as any)
        .from('demo_registrations')
        .select('id, full_name, email, job_title, created_at')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('❌ load demo registrations failed:', error);
        setErrorMessage('Impossible de charger les inscrits');
        return;
      }
      setRegistrations(data || []);
    })();
  }, [isAuthenticated]);

  const handleExportCsv = () => {
    const escapeCell = (value: string) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [['Date', 'Nom', 'Email', 'Métier'], ...registrations.map((r) => [
      new Date(r.created_at).toLocaleString('fr-FR'), r.full_name, r.email, r.job_title,
    ])];
    const csv = '\uFEFF' + rows.map((row) => row.map(escapeCell).join(';')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `inscrits-demo-live-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (isLoading) return <p className="p-8">Chargement…</p>;
  if (!isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif">Inscrits démo live</h1>
            <p className="text-muted-foreground mt-1">{registrations.length} inscrit(s)</p>
          </div>
          <Button onClick={handleExportCsv} disabled={!registrations.length}>Exporter CSV</Button>
        </div>
        {errorMessage && <p role="alert" className="text-destructive">{errorMessage}</p>}
        <div className="overflow-x-auto border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr><th className="p-3">Date</th><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Métier</th></tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString('fr-FR')}</td>
                  <td className="p-3">{r.full_name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3">{r.job_title}</td>
                </tr>
              ))}
              {!registrations.length && !errorMessage && (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Aucun inscrit pour le moment</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DemoRegistrations;
