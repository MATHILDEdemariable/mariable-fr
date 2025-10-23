import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Users, UserPlus, FileSpreadsheet } from 'lucide-react';
import SeatingPlanStats from '@/components/seating-plan/SeatingPlanStats';
import TablesList from '@/components/seating-plan/TablesList';
import GuestList from '@/components/seating-plan/GuestList';
import TableEditor from '@/components/seating-plan/TableEditor';
import ImportRSVPDialog from '@/components/seating-plan/ImportRSVPDialog';
import ManualGuestDialog from '@/components/seating-plan/ManualGuestDialog';
import { ImportExcelDialog } from '@/components/seating-plan/ImportExcelDialog';
import ExportPDFButton from '@/components/seating-plan/ExportPDFButton';
import { SeatingTable, SeatingAssignment, SeatingPlan as SeatingPlanType } from '@/types/seating';

const SeatingPlan = () => {
  const [plan, setPlan] = useState<SeatingPlanType | null>(null);
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [guests, setGuests] = useState<SeatingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showImportExcel, setShowImportExcel] = useState(false);
  const [editingTable, setEditingTable] = useState<SeatingTable | null>(null);

  useEffect(() => {
    loadSeatingPlan();
  }, []);

  const loadSeatingPlan = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Charger ou créer le plan de table
      let { data: plans } = await supabase
        .from('seating_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!plans || plans.length === 0) {
        const { data: newPlan } = await supabase
          .from('seating_plans')
          .insert({ user_id: user.id, name: 'Mon Plan de Table' })
          .select()
          .single();
        setPlan(newPlan);
      } else {
        setPlan(plans[0]);
      }

      const planId = (plans && plans[0]?.id) || plan?.id;
      if (!planId) return;

      // Charger les tables
      const { data: tablesData } = await supabase
        .from('seating_tables')
        .select('*')
        .eq('seating_plan_id', planId)
        .order('table_number');
      setTables((tablesData || []) as SeatingTable[]);

      // Charger tous les invités filtrés par seating_plan_id
      const { data: guestsData } = await supabase
        .from('seating_assignments')
        .select('*')
        .eq('seating_plan_id', planId);
      setGuests((guestsData || []) as SeatingAssignment[]);
    } catch (error) {
      console.error('Erreur chargement plan de table:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le plan de table',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const guestId = draggableId.replace('guest-', '');
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return;

    // Si déplacé vers liste non assignés
    if (destination.droppableId === 'unassigned') {
      const { error } = await supabase
        .from('seating_assignments')
        .update({ table_id: null })
        .eq('id', guestId);

      if (error) {
        toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
        return;
      }

      setGuests(guests.map(g => g.id === guestId ? { ...g, table_id: null } : g));
      toast({ title: 'Invité retiré de la table' });
      return;
    }

    // Déplacé vers une table
    const targetTableId = destination.droppableId.replace('table-', '');
    const targetTable = tables.find(t => t.id === targetTableId);
    if (!targetTable) return;

    // Vérifier capacité
    const currentGuests = guests.filter(g => g.table_id === targetTableId);
    if (currentGuests.length >= targetTable.capacity) {
      toast({
        title: 'Table pleine',
        description: `Cette table ne peut accueillir que ${targetTable.capacity} personnes`,
        variant: 'destructive'
      });
      return;
    }

    // Mettre à jour l'assignation
    const { error } = await supabase
      .from('seating_assignments')
      .update({ table_id: targetTableId })
      .eq('id', guestId);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }

    setGuests(guests.map(g => g.id === guestId ? { ...g, table_id: targetTableId } : g));
    toast({ title: 'Invité déplacé avec succès' });
  };

  const handleAddTable = () => {
    setEditingTable(null);
    setShowTableEditor(true);
  };

  const handleEditTable = (table: SeatingTable) => {
    setEditingTable(table);
    setShowTableEditor(true);
  };

  const handleDeleteTable = async (tableId: string) => {
    const tableGuests = guests.filter(g => g.table_id === tableId);
    if (tableGuests.length > 0) {
      if (!confirm(`Cette table contient ${tableGuests.length} invité(s). Voulez-vous vraiment la supprimer ?`)) {
        return;
      }
    }

    const { error } = await supabase
      .from('seating_tables')
      .delete()
      .eq('id', tableId);

    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
      return;
    }

    setTables(tables.filter(t => t.id !== tableId));
    setGuests(guests.filter(g => g.table_id !== tableId));
    toast({ title: 'Table supprimée' });
  };

  const unassignedGuests = guests.filter(g => !g.table_id);
  const assignedGuests = guests.filter(g => g.table_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du plan de table...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Plan de Table - Mariable</title>
        <meta name="description" content="Organisez votre plan de table de mariage" />
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Plan de Table</h1>
            <p className="text-muted-foreground mt-1">
              Organisez vos invités avec drag & drop <Badge variant="secondary" className="ml-2">BETA</Badge>
            </p>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-12 gap-6">
            {/* Colonne 1: Outils et Stats (20%) */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <div className="space-y-2">
                <Button onClick={handleAddTable} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Table
                </Button>
                <Button onClick={() => setShowImportDialog(true)} variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Importer depuis RSVP
                </Button>
                <Button onClick={() => setShowImportExcel(true)} variant="outline" className="w-full">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Importer CSV
                </Button>
                <Button onClick={() => setShowGuestDialog(true)} variant="outline" className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter Invité
                </Button>
                <ExportPDFButton plan={plan} tables={tables} guests={guests} />
              </div>

              <SeatingPlanStats 
                totalGuests={guests.length}
                assignedGuests={assignedGuests.length}
                tablesCount={tables.length}
                tables={tables}
                guests={guests}
              />
            </div>

            {/* Colonne 2: Zone des tables (55%) */}
            <div className="col-span-12 lg:col-span-6">
              <TablesList
                tables={tables}
                guests={guests}
                onEditTable={handleEditTable}
                onDeleteTable={handleDeleteTable}
              />
            </div>

            {/* Colonne 3: Invités non assignés (25%) */}
            <div className="col-span-12 lg:col-span-3">
              <GuestList guests={unassignedGuests} />
            </div>
          </div>
        </DragDropContext>

        {/* Dialogs */}
        <TableEditor
          open={showTableEditor}
          onOpenChange={setShowTableEditor}
          table={editingTable}
          planId={plan?.id || ''}
          onSaved={loadSeatingPlan}
        />

        <ImportRSVPDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          planId={plan?.id || ''}
          onImported={loadSeatingPlan}
        />

        <ManualGuestDialog
          open={showGuestDialog}
          onOpenChange={setShowGuestDialog}
          planId={plan?.id || ''}
          tables={tables}
          onAdded={loadSeatingPlan}
        />

        <ImportExcelDialog
          open={showImportExcel}
          onOpenChange={setShowImportExcel}
          planId={plan?.id || ''}
          onImported={loadSeatingPlan}
        />
      </div>
    </>
  );
};

export default SeatingPlan;
