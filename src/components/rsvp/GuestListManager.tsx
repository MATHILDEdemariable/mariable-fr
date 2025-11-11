import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Plus, Search, Download, Loader2, Pencil, Trash2, Users } from 'lucide-react';
import GuestImportDialog from './GuestImportDialog';
import GuestManualAdd from './GuestManualAdd';

interface Guest {
  id: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  guest_address: string | null;
  guest_type: 'adult' | 'child';
  source: string;
  created_at: string;
}

const GuestListManager: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wedding_guest_list')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuests((data || []) as Guest[]);
    } catch (error) {
      console.error('Erreur lors du chargement des invités:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des invités',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('wedding_guest_list')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      setGuests(guests.filter(g => g.id !== guestId));
      toast({
        title: 'Invité supprimé',
        description: 'L\'invité a été supprimé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'invité',
        variant: 'destructive',
      });
    }
  };

  const exportToCSV = () => {
    const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Type', 'Source', 'Date ajout'];
    const rows = guests.map(g => [
      g.guest_first_name,
      g.guest_last_name,
      g.guest_email || '',
      g.guest_phone || '',
      g.guest_address || '',
      g.guest_type === 'adult' ? 'Adulte' : 'Enfant',
      g.source,
      new Date(g.created_at).toLocaleDateString('fr-FR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `liste-invites-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Export réussi',
      description: 'Le fichier CSV a été téléchargé',
    });
  };

  const filteredGuests = guests.filter(g =>
    g.guest_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.guest_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.guest_phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Liste d'invités</h2>
          <p className="text-muted-foreground">
            {guests.length} invité{guests.length > 1 ? 's' : ''} • 
            {guests.filter(g => g.guest_type === 'adult').length} adulte{guests.filter(g => g.guest_type === 'adult').length > 1 ? 's' : ''} • 
            {guests.filter(g => g.guest_type === 'child').length} enfant{guests.filter(g => g.guest_type === 'child').length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un invité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredGuests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun invité</h3>
            <p className="text-muted-foreground mb-6">
              Commencez par ajouter des invités manuellement ou en important un fichier
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un invité
              </Button>
              <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importer un fichier
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="text-left p-4 font-medium">Nom</th>
                    <th className="text-left p-4 font-medium">Email</th>
                    <th className="text-left p-4 font-medium">Téléphone</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Source</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b hover:bg-muted/20">
                      <td className="p-4">
                        <div className="font-medium">
                          {guest.guest_first_name} {guest.guest_last_name}
                        </div>
                        {guest.guest_address && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {guest.guest_address}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-sm">{guest.guest_email || '-'}</td>
                      <td className="p-4 text-sm">{guest.guest_phone || '-'}</td>
                      <td className="p-4">
                        <Badge variant={guest.guest_type === 'adult' ? 'default' : 'secondary'}>
                          {guest.guest_type === 'adult' ? 'Adulte' : 'Enfant'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">
                          {guest.source === 'manual' && 'Manuel'}
                          {guest.source === 'excel' && 'Excel'}
                          {guest.source === 'txt' && 'Texte'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(guest.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <GuestImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImported={loadGuests}
      />

      <GuestManualAdd
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdded={loadGuests}
      />
    </div>
  );
};

export default GuestListManager;
