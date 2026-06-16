import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Download, Users, UserPlus, FileSpreadsheet, Play, List, LayoutGrid } from 'lucide-react';
import { TutorialVideoModal } from '@/components/tutorials/TutorialVideoModal';
import SeatingPlanStats from '@/components/seating-plan/SeatingPlanStats';
import TablesList from '@/components/seating-plan/TablesList';
import GuestList from '@/components/seating-plan/GuestList';
import TableEditor from '@/components/seating-plan/TableEditor';
import ImportRSVPDialog from '@/components/seating-plan/ImportRSVPDialog';
import ImportGuestListDialog from '@/components/seating-plan/ImportGuestListDialog';
import ManualGuestDialog from '@/components/seating-plan/ManualGuestDialog';
import { ImportExcelDialog } from '@/components/seating-plan/ImportExcelDialog';
import ExportPDFButton from '@/components/seating-plan/ExportPDFButton';
import ExportVisualPDFButton from '@/components/seating-plan/ExportVisualPDFButton';
import SeatingPlanVisual from '@/components/seating-plan/SeatingPlanVisual';
import { SeatingTable, SeatingAssignment, SeatingPlan as SeatingPlanType } from '@/types/seating';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const SeatingPlan = () => {
  const { t } = useTranslation('seating');
  const [plan, setPlan] = useState<SeatingPlanType | null>(null);
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [guests, setGuests] = useState<SeatingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTableEditor, setShowTableEditor] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showImportGuestList, setShowImportGuestList] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [showImportExcel, setShowImportExcel] = useState(false);
  const [editingTable, setEditingTable] = useState<SeatingTable | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'visual'>('list');
  
  const { 
    executeAction, 
    showPremiumModal, 
    closePremiumModal 
  } = usePremiumAction({
    feature: t('premium.feature'),
    description: t('premium.description')
  });

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
        .select('id, user_id, name, event_date, venue_name, notes, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!plans || plans.length === 0) {
        const { data: newPlan } = await supabase
          .from('seating_plans')
          .insert({ user_id: user.id, name: t('toast.defaultPlanName') })
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
        .select('id, seating_plan_id, table_name, table_number, capacity, shape, position_x, position_y, color, created_at')
        .eq('seating_plan_id', planId)
        .order('table_number');
      setTables((tablesData || []) as SeatingTable[]);

      // Charger tous les invités filtrés par seating_plan_id
      const { data: guestsData } = await supabase
        .from('seating_assignments')
        .select('id, seating_plan_id, table_id, guest_name, rsvp_response_id, guest_type, dietary_restrictions, seat_number, notes, created_at')
        .eq('seating_plan_id', planId);
      setGuests((guestsData || []) as SeatingAssignment[]);
    } catch (error) {
      console.error('Erreur chargement plan de table:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('toast.loadError'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    executeAction(async () => {
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
        toast({ title: t('toast.errorTitle'), description: error.message, variant: 'destructive' });
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
      toast({ title: t('toast.errorTitle'), description: error.message, variant: 'destructive' });
      return;
    }

      setGuests(guests.map(g => g.id === guestId ? { ...g, table_id: targetTableId } : g));
      toast({ title: 'Invité déplacé avec succès' });
    });
  };

  const handleAddTable = () => {
    executeAction(() => {
      setEditingTable(null);
      setShowTableEditor(true);
    });
  };

  const handleEditTable = (table: SeatingTable) => {
    executeAction(() => {
      setEditingTable(table);
      setShowTableEditor(true);
    });
  };

  const handleDeleteTable = (tableId: string) => {
    executeAction(async () => {
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
      toast({ title: t('toast.errorTitle'), description: error.message, variant: 'destructive' });
      return;
    }

      setTables(tables.filter(t => t.id !== tableId));
      setGuests(guests.filter(g => g.table_id !== tableId));
      toast({ title: t('toast.tableDeleted') });
    });
  };

  const handleDeleteGuest = async (guestId: string) => {
    const { error } = await supabase
      .from('seating_assignments')
      .delete()
      .eq('id', guestId);

    if (error) {
      toast({ title: t('toast.errorTitle'), description: error.message, variant: 'destructive' });
      return;
    }

    setGuests(guests.filter(g => g.id !== guestId));
    toast({ title: t('toast.guestDeleted') });
  };

  const handleDeleteAllUnassignedGuests = async () => {
    const unassigned = guests.filter(g => !g.table_id);
    if (unassigned.length === 0) return;

    const { error } = await supabase
      .from('seating_assignments')
      .delete()
      .in('id', unassigned.map(g => g.id));

    if (error) {
      toast({ title: t('toast.errorTitle'), description: error.message, variant: 'destructive' });
      return;
    }

    setGuests(guests.filter(g => g.table_id));
    toast({ title: t('toast.guestsDeleted', { count: unassigned.length }) });
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
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-foreground">{t('page.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('page.subtitle')} <Badge variant="secondary" className="ml-2">BETA</Badge>
            </p>
          </div>
        </div>

        {/* View toggle tabs */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as 'list' | 'visual')} className="mb-6">
          <TabsList className="bg-gray-100 border border-gray-300">
            <TabsTrigger value="list" className="data-[state=active]:bg-black data-[state=active]:text-white font-medium">
              <List className="h-4 w-4 mr-2" />
              Liste
            </TabsTrigger>
            <TabsTrigger value="visual" className="data-[state=active]:bg-black data-[state=active]:text-white font-medium">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Vue Visuelle
            </TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-12 gap-6">
                {/* Colonne 1: Outils et Stats (20%) */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                  <div className="space-y-2">
                    <Button onClick={handleAddTable} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Table
                    </Button>
                    <Button onClick={() => executeAction(() => setShowImportDialog(true))} variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Importer depuis RSVP
                    </Button>
                    <Button onClick={() => executeAction(() => setShowImportGuestList(true))} variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Importer liste manuelle
                    </Button>
                    <Button onClick={() => executeAction(() => setShowImportExcel(true))} variant="outline" className="w-full">
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Importer CSV
                    </Button>
                    <Button onClick={() => setShowTutorial(true)} variant="outline" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Tuto vidéo
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
                  <GuestList 
                    guests={unassignedGuests} 
                    onDeleteGuest={handleDeleteGuest}
                    onDeleteAllGuests={handleDeleteAllUnassignedGuests}
                  />
                </div>
              </div>
            </DragDropContext>
          </TabsContent>

          {/* Visual View */}
          <TabsContent value="visual">
            <div className="grid grid-cols-12 gap-6">
              {/* Sidebar with tools */}
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="space-y-2">
                  <Button onClick={handleAddTable} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Table
                  </Button>
                  <ExportPDFButton plan={plan} tables={tables} guests={guests} />
                  <ExportVisualPDFButton />
                </div>

                <SeatingPlanStats 
                  totalGuests={guests.length}
                  assignedGuests={assignedGuests.length}
                  tablesCount={tables.length}
                  tables={tables}
                  guests={guests}
                />
              </div>

              {/* Visual canvas */}
              <div className="col-span-12 lg:col-span-9">
                <SeatingPlanVisual
                  tables={tables}
                  guests={guests}
                  onTablePositionUpdate={loadSeatingPlan}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

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

        <ImportGuestListDialog
          open={showImportGuestList}
          onOpenChange={setShowImportGuestList}
          planId={plan?.id || ''}
          onImported={loadSeatingPlan}
        />

        <TutorialVideoModal 
          isOpen={showTutorial} 
          onClose={() => setShowTutorial(false)} 
          videoId="seating-plan" 
        />
      </div>
      
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={t('premium.feature')}
        description={t('premium.description')}
      />
    </>
  );
};

export default SeatingPlan;
