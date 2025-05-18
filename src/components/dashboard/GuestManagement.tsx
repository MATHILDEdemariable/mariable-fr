
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GuestCounts {
  adults: number;
  children: number;
  vendors: number;
  ceremony: number;
  cocktail: number;
  dinner: number;
  brunch: number;
}

const GuestManagement: React.FC = () => {
  const [guestCounts, setGuestCounts] = useState<GuestCounts>({
    adults: 0,
    children: 0,
    vendors: 0,
    ceremony: 0,
    cocktail: 0,
    dinner: 0,
    brunch: 0
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Calculer le total des invités
  const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.vendors;
  
  // Charger les données sauvegardées
  useEffect(() => {
    const fetchGuestData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('budgets_dashboard')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1);
            
          if (error) throw error;
            
          if (data && data.length > 0 && data[0].breakdown && data[0].breakdown.guests) {
            setGuestCounts(data[0].breakdown.guests);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données d'invités:", error);
      }
    };
    
    fetchGuestData();
  }, []);
  
  // Gérer les changements dans les champs de nombre d'invités
  const handleCountChange = (field: keyof GuestCounts, value: number) => {
    setGuestCounts(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Sauvegarder les données
  const saveGuestData = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get existing budgets data first
        const { data: existingData, error: fetchError } = await supabase
          .from('budgets_dashboard')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        
        if (fetchError) throw fetchError;
        
        let budgetData;
        
        if (existingData && existingData.length > 0) {
          // Update existing record
          budgetData = {
            ...existingData[0],
            guests_count: totalGuests,
            breakdown: {
              ...existingData[0].breakdown,
              guests: guestCounts
            }
          };
        } else {
          // Create new record
          budgetData = {
            user_id: user.id,
            guests_count: totalGuests,
            total_budget: 0,
            breakdown: {
              guests: guestCounts
            },
            region: 'unknown',
            season: 'unknown',
            service_level: 'standard',
            selected_vendors: []
          };
        }
        
        const { error: updateError } = await supabase
          .from('budgets_dashboard')
          .upsert(budgetData);
        
        if (updateError) throw updateError;
        
        toast({
          title: "Données sauvegardées",
          description: "Les informations sur vos invités ont été mises à jour",
        });
      } else {
        toast({
          title: "Non connecté",
          description: "Connectez-vous pour sauvegarder vos données",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Exporter les données en CSV
  const exportToCSV = () => {
    try {
      // Créer le contenu CSV
      let csvContent = "Catégorie,Nombre d'invités\n";
      csvContent += `Adultes,${guestCounts.adults}\n`;
      csvContent += `Enfants,${guestCounts.children}\n`;
      csvContent += `Prestataires,${guestCounts.vendors}\n`;
      csvContent += `Total,${totalGuests}\n\n`;
      csvContent += `Par événement:\n`;
      csvContent += `Cérémonie,${guestCounts.ceremony}\n`;
      csvContent += `Cocktail,${guestCounts.cocktail}\n`;
      csvContent += `Dîner,${guestCounts.dinner}\n`;
      csvContent += `Brunch,${guestCounts.brunch}\n`;
      
      // Créer et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invites-mariage-${format(new Date(), 'yyyy-MM-dd', { locale: fr })}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export réussi",
        description: "Vos données ont été exportées en format CSV"
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="bg-wedding-cream/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-serif text-wedding-olive">Gestion des Invités</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-1">
            <FileText className="h-4 w-4" />
            <span>Exporter CSV</span>
          </Button>
          <Button size="sm" variant="wedding" onClick={saveGuestData} disabled={isLoading}>
            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-wedding-cream/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Invités par type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adults">Nombre d'adultes</Label>
                <Input
                  id="adults"
                  type="number"
                  min="0"
                  value={guestCounts.adults}
                  onChange={e => handleCountChange('adults', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="children">Nombre d'enfants</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={guestCounts.children}
                  onChange={e => handleCountChange('children', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="vendors">Nombre de prestataires</Label>
                <Input
                  id="vendors"
                  type="number"
                  min="0"
                  value={guestCounts.vendors}
                  onChange={e => handleCountChange('vendors', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div className="pt-2 border-t mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-lg font-bold">{totalGuests}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-wedding-cream/30 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Invités par événement</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Événement</TableHead>
                    <TableHead className="w-32 text-right">Nombre d'invités</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Cérémonie</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        value={guestCounts.ceremony}
                        onChange={e => handleCountChange('ceremony', parseInt(e.target.value) || 0)}
                        className="w-20 text-right ml-auto"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cocktail</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        value={guestCounts.cocktail}
                        onChange={e => handleCountChange('cocktail', parseInt(e.target.value) || 0)}
                        className="w-20 text-right ml-auto"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dîner</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        value={guestCounts.dinner}
                        onChange={e => handleCountChange('dinner', parseInt(e.target.value) || 0)}
                        className="w-20 text-right ml-auto"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brunch</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min="0"
                        value={guestCounts.brunch}
                        onChange={e => handleCountChange('brunch', parseInt(e.target.value) || 0)}
                        className="w-20 text-right ml-auto"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-wedding-cream/10 p-4 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Astuce :</strong> Ces informations sont utiles pour faire des estimations précises de votre budget, notamment pour le traiteur et les boissons. Assurez-vous de les tenir à jour.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestManagement;
