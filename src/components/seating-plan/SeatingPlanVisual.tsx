import { useTranslation } from 'react-i18next';
import React, { useState, useRef, useEffect } from 'react';
import { SeatingTable, SeatingAssignment } from '@/types/seating';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { normalizeGuestName } from '@/lib/guestTags';

type RoomShape = 'rectangle' | 'square' | 'L' | 'U';
type FixedElementKind = 'dancefloor' | 'stage' | 'buffet' | 'door';
interface RoomConfig {
  enabled: boolean;
  shape: RoomShape;
  widthM: number;
  lengthM: number;
  pxPerMeter: number;
  showComfort: boolean;
  fixedElements: Array<{ id: string; kind: FixedElementKind; x: number; y: number; w?: number; h?: number }>;
  // Dimensions physiques par table (mètres) : w = diamètre ou longueur, h = largeur
  tableSizes?: Record<string, { w: number; h: number }>;
  showTableNames?: boolean;
}
const ROOM_MARGIN = 50;
const DEFAULT_ROOM: RoomConfig = { enabled: false, shape: 'rectangle', widthM: 16, lengthM: 10, pxPerMeter: 35, showComfort: true, fixedElements: [] };
// Dimensions indicatives en mètres
const FIXED_ELEMENTS: Record<FixedElementKind, { fr: string; en: string; w: number; h: number }> = {
  dancefloor: { fr: 'Piste de danse', en: 'Dance floor', w: 5, h: 5 },
  stage: { fr: 'Scène / DJ', en: 'Stage / DJ', w: 3, h: 2 },
  buffet: { fr: 'Buffet / Bar', en: 'Buffet / Bar', w: 4, h: 1 },
  door: { fr: 'Accès traiteur', en: 'Catering door', w: 1.5, h: 0.6 },
};

interface SeatingPlanVisualProps {
  tables: SeatingTable[];
  guests: SeatingAssignment[];
  onTablePositionUpdate: () => void;
  onEditTable?: (table: SeatingTable) => void;
}

const SeatingPlanVisual: React.FC<SeatingPlanVisualProps> = ({
  tables,
  guests,
  onTablePositionUpdate,
  onEditTable
}) => {
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingTable, setDraggingTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [guestColors, setGuestColors] = useState<Record<string, string>>({});

  // Configuration de salle partagée en ligne (wedding_tool_states, accès par mariage : pro + couple)
  const seatingPlanId = tables[0]?.seating_plan_id;
  const roomToolKey = `seating-room-${seatingPlanId ?? 'default'}`;
  const [showGuestNames, setShowGuestNames] = useState(true);
  const [roomConfig, setRoomConfig] = useState<RoomConfig>(DEFAULT_ROOM);
  const [areaInput, setAreaInput] = useState('');
  const roomStateRef = useRef<{ id: string | null; weddingId: string | null }>({ id: null, weddingId: null });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!seatingPlanId) return;
    const loadRoomConfig = async () => {
      try {
        const { data: plan } = await supabase.from('seating_plans').select('wedding_id').eq('id', seatingPlanId).maybeSingle();
        const weddingId = plan?.wedding_id ?? null;
        let query = supabase.from('wedding_tool_states').select('id, state').eq('tool_key', roomToolKey);
        query = weddingId ? query.eq('wedding_id', weddingId) : query.is('wedding_id', null);
        const { data, error } = await query.order('updated_at', { ascending: false }).limit(1);
        if (error) throw error;
        roomStateRef.current = { id: data?.[0]?.id ?? null, weddingId };
        // Couleurs choisies dans la gestion des invités (rapprochement par nom)
        if (weddingId) {
          const { data: colored } = await supabase.from('wedding_guest_list').select('guest_first_name, guest_last_name, guest_color').eq('wedding_id', weddingId).not('guest_color', 'is', null);
          const map: Record<string, string> = {};
          (colored as any[] | null)?.forEach((g) => { if (g.guest_color) map[normalizeGuestName(`${g.guest_first_name} ${g.guest_last_name}`)] = g.guest_color; });
          setGuestColors(map);
        }
        if (data?.[0]) {
          setRoomConfig({ ...DEFAULT_ROOM, ...(data[0].state as Partial<RoomConfig>) });
        } else {
          // Reprise d'une ancienne configuration enregistrée sur cet appareil
          const legacy = localStorage.getItem(`seating-room-${seatingPlanId}`);
          if (legacy) setRoomConfig({ ...DEFAULT_ROOM, ...JSON.parse(legacy) });
        }
      } catch (error) { console.error('Erreur lecture configuration salle:', error); }
    };
    loadRoomConfig();
  }, [seatingPlanId, roomToolKey]);
  const saveRoomConfig = (config: RoomConfig) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const { id, weddingId } = roomStateRef.current;
        if (id) {
          const { error } = await supabase.from('wedding_tool_states').update({ state: config as any }).eq('id', id);
          if (error) throw error;
        } else {
          const { data: auth } = await supabase.auth.getUser();
          if (!auth.user) return;
          const { data, error } = await supabase.from('wedding_tool_states')
            .insert({ user_id: auth.user.id, wedding_id: weddingId, tool_key: roomToolKey, state: config as any })
            .select('id').single();
          if (error) throw error;
          roomStateRef.current.id = data.id;
        }
      } catch (error) {
        console.error('Erreur sauvegarde salle:', error);
        toast({ title: tr('Configuration de salle non enregistrée', 'Room setup not saved'), variant: 'destructive' });
      }
    }, 600);
  };
  const updateRoom = (patch: Partial<RoomConfig>) => {
    setRoomConfig((prev) => {
      const next = { ...prev, ...patch };
      saveRoomConfig(next);
      return next;
    });
  };
  const applyArea = (value: string) => {
    setAreaInput(value);
    const area = parseFloat(value.replace(',', '.'));
    if (!area || area <= 0) return;
    const width = roomConfig.shape === 'square' ? Math.sqrt(area) : Math.sqrt(area * 1.6);
    updateRoom({ widthM: Math.round(width * 10) / 10, lengthM: Math.round((area / width) * 10) / 10 });
  };
  const ppm = roomConfig.pxPerMeter;
  const roomW = roomConfig.widthM * ppm;
  const roomL = (roomConfig.shape === 'square' ? roomConfig.widthM : roomConfig.lengthM) * ppm;

  // Initialize positions from database or default grid
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    tables.forEach((table, index) => {
      positions[table.id] = {
        x: table.position_x ?? (100 + (index % 4) * 180),
        y: table.position_y ?? (100 + Math.floor(index / 4) * 180)
      };
    });
    setTablePositions(positions);
  }, [tables]);

  const getTableGuests = (tableId: string) => {
    return guests.filter(g => g.table_id === tableId).sort((a, b) => (a.seat_number ?? 0) - (b.seat_number ?? 0));
  };

  // Extract first name from full name

  // Handle guest click for seat swapping
  const handleGuestClick = async (guestId: string, tableId: string) => {
    if (selectedGuest === null) {
      // First click: select this guest
      setSelectedGuest(guestId);
    } else if (selectedGuest === guestId) {
      // Same guest clicked: deselect
      setSelectedGuest(null);
    } else {
      // Autre invité : échange de places, y compris entre deux tables différentes
      const guest1 = guests.find(g => g.id === selectedGuest);
      const guest2 = guests.find(g => g.id === guestId);
      if (guest1 && guest2) {
        try {
          const results = await Promise.all([
            supabase.from('seating_assignments').update({ table_id: guest2.table_id, seat_number: guest2.seat_number }).eq('id', guest1.id),
            supabase.from('seating_assignments').update({ table_id: guest1.table_id, seat_number: guest1.seat_number }).eq('id', guest2.id)
          ]);
          const failed = results.find((r) => r.error);
          if (failed?.error) throw failed.error;
          toast({ title: tr('Places échangées', 'Seats swapped'), description: `${guest1.guest_name} ⇄ ${guest2.guest_name}` });
          onTablePositionUpdate();
        } catch (error) {
          console.error('❌ Échange de places échoué:', error);
          toast({ title: tr('Erreur', 'Error'), description: tr("Impossible d'échanger les places", 'Unable to swap seats'), variant: 'destructive' });
        }
      }
      setSelectedGuest(null);
    }
  };

  // Invité sélectionné puis clic sur une autre table : déplacement si place libre
  const moveSelectedGuestToTable = async (tableId: string) => {
    const guest = guests.find(g => g.id === selectedGuest);
    const table = tables.find(t => t.id === tableId);
    if (!guest || !table) return;
    setSelectedGuest(null);
    if (guest.table_id === tableId) return;
    const seated = guests.filter(g => g.table_id === tableId);
    if (seated.length >= table.capacity) {
      toast({ title: tr('Table complète', 'Table full'), description: tr('Cliquez sur un invité de cette table pour échanger.', 'Click a guest at this table to swap instead.'), variant: 'destructive' });
      return;
    }
    const usedSeats = new Set(seated.map(g => g.seat_number));
    let seat = 1;
    while (usedSeats.has(seat)) seat++;
    const { error } = await supabase.from('seating_assignments').update({ table_id: tableId, seat_number: seat }).eq('id', guest.id);
    if (error) {
      console.error('❌ Déplacement invité échoué:', error);
      toast({ title: tr('Erreur', 'Error'), description: tr("Impossible de déplacer l'invité", 'Unable to move guest'), variant: 'destructive' });
      return;
    }
    toast({ title: tr('Invité déplacé', 'Guest moved'), description: `${guest.guest_name} → ${table.table_name}` });
    onTablePositionUpdate();
  };

  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).closest('.table-shape')?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    }
    setDraggingTable(tableId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;

    // Keep within bounds
    const boundedX = Math.max(20, Math.min(containerRect.width - 20, newX));
    const boundedY = Math.max(20, Math.min(containerRect.height - 20, newY));

    setTablePositions(prev => ({
      ...prev,
      [draggingTable]: { x: boundedX, y: boundedY }
    }));
  };

  const handleMouseUp = async () => {
    if (!draggingTable) return;
    if (draggingTable.startsWith('fixed:')) {
      const elementId = draggingTable.slice(6);
      const position = tablePositions[draggingTable];
      if (position) updateRoom({ fixedElements: roomConfig.fixedElements.map((el) => el.id === elementId ? { ...el, x: Math.round(position.x), y: Math.round(position.y) } : el) });
      setDraggingTable(null);
      return;
    }

    const position = tablePositions[draggingTable];
    if (position) {
      // Save position to database
      const { error } = await supabase
        .from('seating_tables')
        .update({ 
          position_x: Math.round(position.x), 
          position_y: Math.round(position.y) 
        })
        .eq('id', draggingTable);

      if (error) {
        toast({
          title: tr('Erreur','Error'),
          description: tr('Impossible de sauvegarder la position','Unable to save position'),
          variant: 'destructive'
        });
      }
    }

    setDraggingTable(null);
    onTablePositionUpdate();
  };

  const getTableShape = (shape: string) => {
    switch (shape) {
      case 'rectangle':
        return 'rounded-lg';
      case 'oval':
        return 'rounded-[50%]';
      case 'round':
      default:
        return 'rounded-full';
    }
  };

  const defaultTableMeters = (shape: string, capacity: number) => {
    if (shape === 'rectangle') return { w: 2, h: 0.9 };
    if (shape === 'oval') return { w: 2, h: 1.1 };
    const d = capacity <= 8 ? 1.5 : 1.8;
    return { w: d, h: d };
  };
  const getTableMeters = (tableId: string, shape: string, capacity: number) => roomConfig.tableSizes?.[tableId] ?? defaultTableMeters(shape, capacity);
  const updateTableSize = (tableId: string, patch: Partial<{ w: number; h: number }>, shape: string, capacity: number) => {
    const current = getTableMeters(tableId, shape, capacity);
    const next = { ...current, ...patch };
    if (shape === 'round') next.h = next.w;
    updateRoom({ tableSizes: { ...(roomConfig.tableSizes || {}), [tableId]: next } });
  };
  const getTableSize = (shape: string, capacity: number, tableId?: string) => {
    const custom = tableId ? roomConfig.tableSizes?.[tableId] : undefined;
    if (custom) {
      // Hors mode salle : échelle d'affichage fixe pour garder les proportions
      const scale = roomConfig.enabled ? ppm : 55;
      return { width: custom.w * scale, height: (shape === 'round' ? custom.w : custom.h) * scale };
    }
    if (roomConfig.enabled) {
      if (shape === 'rectangle') return { width: 2 * ppm, height: 0.9 * ppm };
      if (shape === 'oval') return { width: 2 * ppm, height: 1.1 * ppm };
      const diameter = (capacity <= 8 ? 1.5 : 1.8) * ppm;
      return { width: diameter, height: diameter };
    }
    const baseSize = Math.max(80, Math.min(140, 60 + capacity * 8));
    if (shape === 'rectangle') {
      return { width: baseSize * 1.5, height: baseSize };
    }
    if (shape === 'oval') {
      return { width: baseSize * 1.3, height: baseSize };
    }
    return { width: baseSize, height: baseSize };
  };

  const roomPolygon = () => {
    const x0 = ROOM_MARGIN, y0 = ROOM_MARGIN, w = roomW, l = roomL;
    if (roomConfig.shape === 'L') return [[0,0],[w,0],[w,l*0.5],[w*0.5,l*0.5],[w*0.5,l],[0,l]].map(([x,y]) => `${x0+x},${y0+y}`).join(' ');
    if (roomConfig.shape === 'U') return [[0,0],[w*0.33,0],[w*0.33,l*0.5],[w*0.67,l*0.5],[w*0.67,0],[w,0],[w,l],[0,l]].map(([x,y]) => `${x0+x},${y0+y}`).join(' ');
    return [[0,0],[w,0],[w,l],[0,l]].map(([x,y]) => `${x0+x},${y0+y}`).join(' ');
  };
  const showTableNames = roomConfig.showTableNames !== false;
  const selectedTable = selectedItem && !selectedItem.startsWith('fixed:') ? tables.find((t) => t.id === selectedItem) : undefined;
  const selectedFixed = selectedItem?.startsWith('fixed:') ? roomConfig.fixedElements.find((el) => el.id === selectedItem.slice(6)) : undefined;
  const updateFixedElement = (elementId: string, patch: { w?: number; h?: number }) => {
    updateRoom({ fixedElements: roomConfig.fixedElements.map((el) => el.id === elementId ? { ...el, ...patch } : el) });
  };
  const removeFixedElement = (elementId: string) => {
    updateRoom({ fixedElements: roomConfig.fixedElements.filter((el) => el.id !== elementId) });
    setSelectedItem(null);
  };
  const surfaceM2 = Math.round(roomConfig.widthM * (roomConfig.shape === 'square' ? roomConfig.widthM : roomConfig.lengthM) * (roomConfig.shape === 'L' ? 0.75 : roomConfig.shape === 'U' ? 0.83 : 1));
  const addFixedElement = (kind: FixedElementKind) => {
    const id = `${kind}-${Date.now()}`;
    updateRoom({ fixedElements: [...roomConfig.fixedElements, { id, kind, x: ROOM_MARGIN + roomW / 2, y: ROOM_MARGIN + roomL / 2 }] });
  };

  return (
    <div className="space-y-3">
      {/* Barre d'outils : lisibilité & salle à l'échelle */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" onClick={() => setShowGuestNames((v) => !v)} className="min-h-[44px] px-3 border border-wedding-olive/40 bg-white hover:bg-editorial-cream" aria-pressed={!showGuestNames}>
          {showGuestNames ? tr('Vue épurée (tables et compteurs)', 'Clean view (tables & counts)') : tr('Afficher les noms des invités', 'Show guest names')}
        </button>
        <button type="button" onClick={() => updateRoom({ enabled: !roomConfig.enabled })} className={cn('min-h-[44px] px-3 border border-wedding-olive/40', roomConfig.enabled ? 'bg-wedding-olive text-white' : 'bg-white hover:bg-editorial-cream')} aria-pressed={roomConfig.enabled}>
          📐 {tr('Configuration de la salle à l’échelle', 'Room setup to scale')}
        </button>
        <button type="button" onClick={() => updateRoom({ showTableNames: !showTableNames })} className="min-h-[44px] px-3 border border-wedding-olive/40 bg-white hover:bg-editorial-cream" aria-pressed={!showTableNames}>
          {showTableNames ? tr('Masquer les noms des tables', 'Hide table names') : tr('Afficher les noms des tables', 'Show table names')}
        </button>
      </div>

      {/* Panneau de l'élément sélectionné */}
      {selectedTable && (() => {
        const meters = getTableMeters(selectedTable.id, selectedTable.shape, selectedTable.capacity);
        return (
          <div className="flex flex-wrap items-end gap-3 p-3 bg-white border-2 border-wedding-olive text-sm">
            <div className="min-w-[140px]">
              <p className="text-xs text-muted-foreground">{tr('Table sélectionnée', 'Selected table')}</p>
              <p className="font-semibold">{selectedTable.table_name}</p>
            </div>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{selectedTable.shape === 'round' ? tr('Diamètre (m)', 'Diameter (m)') : tr('Longueur (m)', 'Length (m)')}</span>
              <input type="number" min={0.6} max={10} step={0.1} className="min-h-[44px] w-24 border px-2" value={meters.w} onChange={(e) => updateTableSize(selectedTable.id, { w: Math.max(0.6, Number(e.target.value) || 0.6) }, selectedTable.shape, selectedTable.capacity)} />
            </label>
            {selectedTable.shape !== 'round' && (
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">{tr('Largeur (m)', 'Width (m)')}</span>
                <input type="number" min={0.6} max={5} step={0.1} className="min-h-[44px] w-24 border px-2" value={meters.h} onChange={(e) => updateTableSize(selectedTable.id, { h: Math.max(0.6, Number(e.target.value) || 0.6) }, selectedTable.shape, selectedTable.capacity)} />
              </label>
            )}
            {onEditTable && (
              <button type="button" onClick={() => onEditTable(selectedTable)} className="min-h-[44px] px-4 bg-wedding-olive text-white font-medium">
                ✎ {tr('Modifier la table', 'Edit table')}
              </button>
            )}
            <button type="button" onClick={() => setSelectedItem(null)} className="min-h-[44px] px-3 border">{tr('Fermer', 'Close')}</button>
          </div>
        );
      })()}
      {selectedFixed && (
        <div className="flex flex-wrap items-end gap-3 p-3 bg-white border-2 border-wedding-olive text-sm">
          <div className="min-w-[140px]">
            <p className="text-xs text-muted-foreground">{tr('Élément sélectionné', 'Selected element')}</p>
            <p className="font-semibold">{tr(FIXED_ELEMENTS[selectedFixed.kind].fr, FIXED_ELEMENTS[selectedFixed.kind].en)}</p>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Longueur (m)', 'Length (m)')}</span>
            <input type="number" min={0.5} max={30} step={0.5} className="min-h-[44px] w-24 border px-2" value={selectedFixed.w ?? FIXED_ELEMENTS[selectedFixed.kind].w} onChange={(e) => updateFixedElement(selectedFixed.id, { w: Math.max(0.5, Number(e.target.value) || 0.5) })} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Largeur (m)', 'Width (m)')}</span>
            <input type="number" min={0.5} max={30} step={0.5} className="min-h-[44px] w-24 border px-2" value={selectedFixed.h ?? FIXED_ELEMENTS[selectedFixed.kind].h} onChange={(e) => updateFixedElement(selectedFixed.id, { h: Math.max(0.5, Number(e.target.value) || 0.5) })} />
          </label>
          <button type="button" onClick={() => removeFixedElement(selectedFixed.id)} className="min-h-[44px] px-4 border border-destructive text-destructive font-medium">
            ✕ {tr('Supprimer', 'Delete')}
          </button>
          <button type="button" onClick={() => setSelectedItem(null)} className="min-h-[44px] px-3 border">{tr('Fermer', 'Close')}</button>
        </div>
      )}

      {roomConfig.enabled && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 p-3 bg-white border border-wedding-olive/30 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Forme', 'Shape')}</span>
            <select className="min-h-[44px] border px-2 bg-white" value={roomConfig.shape} onChange={(e) => updateRoom({ shape: e.target.value as RoomShape })}>
              <option value="rectangle">{tr('Rectangulaire', 'Rectangular')}</option>
              <option value="square">{tr('Carrée', 'Square')}</option>
              <option value="L">{tr('En L', 'L-shaped')}</option>
              <option value="U">{tr('En U', 'U-shaped')}</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Surface (m²)', 'Area (m²)')}</span>
            <input type="number" min={10} inputMode="decimal" className="min-h-[44px] border px-2" placeholder="160" value={areaInput} onChange={(e) => applyArea(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Largeur (m)', 'Width (m)')}</span>
            <input type="number" min={3} step={0.5} className="min-h-[44px] border px-2" value={roomConfig.widthM} onChange={(e) => updateRoom({ widthM: Math.max(3, Number(e.target.value) || 3) })} />
          </label>
          {roomConfig.shape !== 'square' && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{tr('Longueur (m)', 'Length (m)')}</span>
              <input type="number" min={3} step={0.5} className="min-h-[44px] border px-2" value={roomConfig.lengthM} onChange={(e) => updateRoom({ lengthM: Math.max(3, Number(e.target.value) || 3) })} />
            </label>
          )}
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Échelle : 1 m =', 'Scale: 1 m =')} {ppm} px</span>
            <input type="range" min={15} max={60} value={ppm} onChange={(e) => updateRoom({ pxPerMeter: Number(e.target.value) })} className="min-h-[44px]" aria-label={tr('Pixels par mètre', 'Pixels per metre')} />
          </label>
          <label className="flex items-center gap-2 min-h-[44px]">
            <input type="checkbox" checked={roomConfig.showComfort} onChange={(e) => updateRoom({ showComfort: e.target.checked })} />
            <span>{tr('Distance de confort 1,50 m', '1.50 m clearance')}</span>
          </label>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{tr('Ajouter un élément', 'Add an element')}</span>
            <select className="min-h-[44px] border px-2 bg-white" value="" onChange={(e) => { if (e.target.value) addFixedElement(e.target.value as FixedElementKind); }}>
              <option value="">+</option>
              {(Object.keys(FIXED_ELEMENTS) as FixedElementKind[]).map((kind) => (
                <option key={kind} value={kind}>{tr(FIXED_ELEMENTS[kind].fr, FIXED_ELEMENTS[kind].en)}</option>
              ))}
            </select>
          </div>
          <p className="col-span-full text-xs text-muted-foreground">
            {tr('Surface', 'Area')} ≈ {surfaceM2} m² · {tr('Tables rondes 150 cm (8 pers.) / 180 cm (10 pers.), rectangles 200 × 90 cm. Glissez tables et éléments ; cliquez dessus pour modifier leurs dimensions.', 'Round tables 150 cm (8 seats) / 180 cm (10 seats), rectangles 200 × 90 cm. Drag tables and elements; click one to edit its size.')}
          </p>
        </div>
      )}

    <div className="w-full overflow-auto rounded-xl border-2 border-dashed border-wedding-olive/30">
    <div
      ref={containerRef}
      className="relative bg-gradient-to-br from-editorial-cream to-white cursor-crosshair"
      style={{ width: roomConfig.enabled ? Math.max(roomW + ROOM_MARGIN * 2, 600) : '100%', height: roomConfig.enabled ? Math.max(roomL + ROOM_MARGIN * 2, 600) : 600 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {roomConfig.enabled && (
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" aria-hidden="true">
          <polygon points={roomPolygon()} fill="hsl(var(--background))" stroke="#63745A" strokeWidth={3} />
          <text x={ROOM_MARGIN} y={ROOM_MARGIN - 10} fontSize={12} fill="#63745A">{roomConfig.widthM} m</text>
          <text x={ROOM_MARGIN - 34} y={ROOM_MARGIN + roomL / 2} fontSize={12} fill="#63745A">{roomConfig.shape === 'square' ? roomConfig.widthM : roomConfig.lengthM} m</text>
          <line x1={ROOM_MARGIN} y1={ROOM_MARGIN + roomL + 20} x2={ROOM_MARGIN + ppm} y2={ROOM_MARGIN + roomL + 20} stroke="#333" strokeWidth={2} />
          <text x={ROOM_MARGIN + ppm + 6} y={ROOM_MARGIN + roomL + 24} fontSize={11} fill="#333">1 m</text>
        </svg>
      )}

      {roomConfig.enabled && roomConfig.fixedElements.map((element) => {
        const config = FIXED_ELEMENTS[element.kind];
        const key = `fixed:${element.id}`;
        const position = tablePositions[key] || { x: element.x, y: element.y };
        const elW = element.w ?? config.w;
        const elH = element.h ?? config.h;
        const isSelected = selectedItem === key;
        return (
          <div
            key={element.id}
            className={cn("table-shape absolute flex flex-col items-center justify-center text-[11px] font-medium text-center border-2 border-dashed border-wedding-olive bg-editorial-olive-light/70 cursor-grab z-0", isSelected && "ring-2 ring-wedding-olive ring-offset-2 border-solid")}
            style={{ left: position.x - (elW * ppm) / 2, top: position.y - (elH * ppm) / 2, width: elW * ppm, height: elH * ppm }}
            onMouseDown={(e) => { setSelectedItem(key); handleMouseDown(e, key); }}
            title={tr('Cliquez pour modifier', 'Click to edit')}
          >
            <span>{tr(config.fr, config.en)}</span>
            <span className="text-[10px] opacity-70">{elW} × {elH} m</span>
          </div>
        );
      })}
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #4a5568 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      {/* Legend */}
      {!roomConfig.enabled && <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-wedding-olive" />
          <span>{tr('Table ronde','Round table')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-lg bg-wedding-olive" />
          <span>{tr('Table rectangle','Rectangular table')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-3 rounded-[50%] bg-wedding-olive" />
          <span>{tr('Table ovale','Oval table')}</span>
        </div>
      </div>}

      {/* Instructions */}
      {!roomConfig.enabled && <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm text-xs text-muted-foreground max-w-[220px]">
        <p className="font-medium text-foreground mb-2">{tr('Mode Vue Visuelle','Visual view mode')}</p>
        <p className="mb-1">• {tr('Glissez les tables pour les repositionner','Drag tables to reposition them')}</p>
        <p className="mb-1">• {tr('Cliquez sur une table pour la modifier ou changer sa taille','Click a table to edit it or change its size')}</p>
        <p className="mb-1">• {tr("Cliquez sur 2 invités d'une même table pour échanger leurs places",'Click 2 guests at the same table to swap seats')}</p>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-[#7F9474] font-medium">
            💡 {tr('Pour déplacer un invité vers une autre table, utilisez l\'onglet « Liste »','To move a guest to another table, use the "List" tab')}
          </p>
        </div>
      </div>}

      {/* Selected guest indicator */}
      {selectedGuest && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-wedding-olive text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
          {tr('Cliquez sur un autre invité de la même table pour échanger','Click another guest at the same table to swap')}
        </div>
      )}

      {/* Tables */}
      {tables.map(table => {
        const position = tablePositions[table.id] || { x: 100, y: 100 };
        const tableGuests = getTableGuests(table.id);
        const size = getTableSize(table.shape, table.capacity, table.id);
        const comfortDiameter = Math.max(size.width, size.height) + 3 * ppm;
        const isFull = tableGuests.length >= table.capacity;
        const isDragging = draggingTable === table.id;

        return (
          <div
            key={table.id}
            className={cn(
              "absolute transition-shadow duration-200",
              isDragging && "z-50"
            )}
            style={{
              left: position.x - size.width / 2,
              top: position.y - size.height / 2,
              transform: isDragging ? 'scale(1.05)' : 'scale(1)',
              transition: isDragging ? 'none' : 'transform 0.2s'
            }}
          >
            {roomConfig.enabled && roomConfig.showComfort && (
              <div className="absolute rounded-full border border-dashed border-wedding-olive/60 bg-wedding-olive/5 pointer-events-none" style={{ width: comfortDiameter, height: comfortDiameter, left: size.width / 2 - comfortDiameter / 2, top: size.height / 2 - comfortDiameter / 2 }} aria-hidden="true" />
            )}
            {/* Table shape */}
            <div
              className={cn(
                "table-shape relative flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2",
                getTableShape(table.shape),
                isFull 
                  ? "bg-wedding-olive text-white border-premium-olive-dark" 
                  : "bg-white text-foreground border-wedding-olive/50 hover:border-wedding-olive",
                (isDragging || selectedItem === table.id) && "shadow-2xl ring-2 ring-wedding-olive ring-offset-2"
              )}
              style={{
                width: size.width,
                height: size.height,
                backgroundColor: table.color || (isFull ? undefined : '#fff')
              }}
              onMouseDown={(e) => { setSelectedItem(table.id); handleMouseDown(e, table.id); }}
              onDoubleClick={() => onEditTable?.(table)}
              title={`${table.table_name} · ${tableGuests.length}/${table.capacity}`}
            >
              {showTableNames && (
                <span className="font-semibold text-xs leading-tight text-center line-clamp-2 max-w-[90%] break-words">
                  {table.table_name}
                </span>
              )}
              <span className="text-xs opacity-80">
                {tableGuests.length}/{table.capacity}
              </span>
            </div>

            {/* Guest indicators around the table */}
            {showGuestNames && tableGuests.slice(0, 12).map((guest, index) => {
              const totalGuests = Math.min(tableGuests.length, 12);
              const angle = (index / totalGuests) * 2 * Math.PI - Math.PI / 2;
              const radius = Math.max(size.width, size.height) / 2 + 22 + Math.max(0, totalGuests - 6) * 4;
              const guestX = Math.cos(angle) * radius;
              const guestY = Math.sin(angle) * radius;
              const isSelected = selectedGuest === guest.id;

              return (
                <div
                  key={guest.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGuestClick(guest.id, table.id);
                  }}
                  className={cn(
                    "absolute rounded-full border-2 shadow-sm flex items-center justify-center font-medium cursor-pointer transition-all duration-200 hover:scale-110",
                    isSelected 
                      ? "bg-wedding-olive text-white border-white ring-2 ring-wedding-olive ring-offset-1 scale-110 z-20 px-2 py-1 min-w-max text-[10px]" 
                      : "bg-white text-premium-olive-dark border-wedding-olive/40 hover:bg-wedding-olive hover:text-white px-2 py-0.5 max-w-[110px] truncate text-[10px] z-10"
                  )}
                  style={{
                    left: size.width / 2 + guestX,
                    top: size.height / 2 + guestY - 10,
                    transform: 'translateX(-50%)',
                    ...(guestColors[normalizeGuestName(guest.guest_name)] && !isSelected ? { borderColor: guestColors[normalizeGuestName(guest.guest_name)], borderWidth: 3 } : {})
                  }}
                  title={`${guest.guest_name}${guest.seat_number ? ` (${tr('Place','Seat')} ${guest.seat_number})` : ''} - ${tr('Cliquez pour échanger','Click to swap')}`}
                >
                  {guest.guest_name}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Empty state */}
      {tables.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">{tr('Aucune table créée','No tables yet')}</p>
            <p className="text-sm">{tr('Créez des tables pour les voir ici','Create tables to see them here')}</p>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default SeatingPlanVisual;
