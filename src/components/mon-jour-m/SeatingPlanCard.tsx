import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ExternalLink, Download, Table2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';

interface SeatingPlanStats {
  tablesCount: number;
  seatedGuests: number;
  totalCapacity: number;
}

const SeatingPlanCard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SeatingPlanStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadSeatingPlanStats();
  }, []);

  const loadSeatingPlanStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer le seating plan de l'utilisateur
      const { data: plan } = await supabase
        .from('seating_plans')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!plan) {
        setStats({ tablesCount: 0, seatedGuests: 0, totalCapacity: 0 });
        return;
      }

      // Récupérer les tables
      const { data: tables } = await supabase
        .from('seating_tables')
        .select('id, capacity')
        .eq('seating_plan_id', plan.id);

      // Récupérer les assignments
      const { data: assignments } = await supabase
        .from('seating_assignments')
        .select('id')
        .eq('seating_plan_id', plan.id);

      const totalCapacity = tables?.reduce((sum, t) => sum + (t.capacity || 0), 0) || 0;

      setStats({
        tablesCount: tables?.length || 0,
        seatedGuests: assignments?.length || 0,
        totalCapacity
      });
    } catch (error) {
      console.error('Erreur chargement stats seating plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer le seating plan complet
      const { data: plan } = await supabase
        .from('seating_plans')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!plan) {
        throw new Error('Aucun plan de table trouvé');
      }

      // Récupérer les tables avec leurs invités
      const { data: tables } = await supabase
        .from('seating_tables')
        .select('*')
        .eq('seating_plan_id', plan.id)
        .order('table_name');

      const { data: assignments } = await supabase
        .from('seating_assignments')
        .select('*')
        .eq('seating_plan_id', plan.id);

      // Créer le PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Titre
      pdf.setFontSize(20);
      pdf.text('Plan de Table', pageWidth / 2, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('Mon Mariage', pageWidth / 2, 30, { align: 'center' });

      let yPosition = 50;

      // Pour chaque table
      tables?.forEach((table) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        const tableAssignments = assignments?.filter(a => a.table_id === table.id) || [];
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${table.table_name} (${tableAssignments.length}/${table.capacity} places)`, 20, yPosition);
        
        yPosition += 8;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        if (tableAssignments.length === 0) {
          pdf.text('  Aucun invité assigné', 20, yPosition);
          yPosition += 6;
        } else {
          tableAssignments.forEach((assignment) => {
            pdf.text(`  • ${assignment.guest_name}`, 20, yPosition);
            yPosition += 5;
          });
        }

        yPosition += 10;
      });

      pdf.save('plan-de-table.pdf');
    } catch (error) {
      console.error('Erreur export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Table2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">🪑 Mon Plan de Table</CardTitle>
              {!isLoading && stats && (
                <p className="text-sm text-muted-foreground">
                  {stats.tablesCount} tables • {stats.seatedGuests}/{stats.totalCapacity} invités placés
                </p>
              )}
            </div>
          </div>
          {stats && stats.tablesCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {Math.round((stats.seatedGuests / stats.totalCapacity) * 100) || 0}% complet
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : stats && stats.tablesCount === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-4">
              Vous n'avez pas encore créé de plan de table
            </p>
            <Button
              onClick={() => navigate('/dashboard/seating-plan')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Créer mon plan de table
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/seating-plan')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir / Modifier
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Export...' : 'Export PDF'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeatingPlanCard;
