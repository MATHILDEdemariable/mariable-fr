
import React from 'react';
import { useBriefContext } from './BriefContext';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Calendar, Eye, Trash2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  onViewPlan: () => void;
}

const BriefsList: React.FC<Props> = ({ onViewPlan }) => {
  const { briefs, setCurrentBrief, deleteBrief, generatePlan } = useBriefContext();

  const handleSelect = (briefId: string) => {
    const brief = briefs.find(b => b.id === briefId);
    if (brief) {
      setCurrentBrief(brief);
      onViewPlan();
    }
  };

  const handleDelete = (briefId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce brief ?")) {
      deleteBrief(briefId);
      toast({
        title: "Brief supprimé",
        description: "Le brief a été supprimé avec succès.",
      });
    }
  };

  const handleGeneratePlan = async (briefId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await generatePlan(briefId);
      toast({
        title: "Plan généré",
        description: "Le plan a été généré avec succès.",
      });
      // Select the brief and view its plan
      const brief = briefs.find(b => b.id === briefId);
      if (brief) {
        setCurrentBrief(brief);
        onViewPlan();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du plan.",
        variant: "destructive",
      });
    }
  };

  if (briefs.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">Aucun brief créé pour le moment.</p>
          <p className="mt-2">Utilisez l'onglet "Créer un Brief" pour commencer à planifier votre mariage.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vos briefs ({briefs.length})</h3>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Couple</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Style</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {briefs.map((brief) => (
              <TableRow 
                key={brief.id}
                onClick={() => handleSelect(brief.id)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {brief.couple.name1} & {brief.couple.name2}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {format(new Date(brief.createdAt), 'dd/MM/yyyy')}
                  </div>
                </TableCell>
                <TableCell>{brief.preferences.style || '-'}</TableCell>
                <TableCell>{brief.budget.total.toLocaleString('fr-FR')} €</TableCell>
                <TableCell>
                  {brief.generatedPlan ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Généré
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      Non généré
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleSelect(brief.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!brief.generatedPlan && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleGeneratePlan(brief.id, e)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleDelete(brief.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BriefsList;
