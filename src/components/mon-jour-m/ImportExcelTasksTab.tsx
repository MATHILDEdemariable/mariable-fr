import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, Upload, FileSpreadsheet, AlertCircle, UserPlus } from 'lucide-react';
import type { usePremiumAction } from '@/hooks/usePremiumAction';

const TEAM_ROLES = [
  'Mariés', 'Témoins', 'Amis', 'Famille', 'Co-organisateur',
  'Prestataires : Lieux', 'Prestataires : Traiteur', 'Prestataires : Coordinateur',
  'Prestataires : Photographe', 'Autre prestataire', 'Autre personne',
];

interface ParsedTaskRow {
  time: string | null;
  title: string;
  duration: number;
  people: string[];
  description: string;
  valid: boolean;
  error?: string;
}

interface ImportExcelTasksTabProps {
  coordinationId: string;
  activeDay?: string;
  startPosition?: number;
  premiumAction: ReturnType<typeof usePremiumAction>;
  onImported: () => void;
  onClose: () => void;
}

const normalizeKey = (value: string): string =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const COLUMN_ALIASES: Record<string, 'time' | 'title' | 'duration' | 'people' | 'description'> = {
  'heure': 'time', 'time': 'time', 'horaire': 'time', 'start time': 'time',
  'etape': 'title', 'tache': 'title', 'titre': 'title', 'step': 'title', 'task': 'title', 'title': 'title',
  'duree (min)': 'duration', 'duree': 'duration', 'duration (min)': 'duration', 'duration': 'duration',
  'personne assignee': 'people', 'personnes assignees': 'people', 'assignee': 'people',
  'assigned to': 'people', 'assigned person': 'people', 'people': 'people',
  'description': 'description', 'notes': 'description', 'note': 'description',
};

const parseTimeCell = (raw: unknown): string | null => {
  if (raw === null || raw === undefined || raw === '') return null;

  if (typeof raw === 'number') {
    const totalMinutes = Math.round(raw * 24 * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const text = raw.toString().trim().replace(/h/i, ':');
  const match = text.match(/^(\d{1,2})\s*[:.]?\s*(\d{2})?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? '0');
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const splitPeople = (raw: unknown): string[] =>
  (raw ?? '')
    .toString()
    .split(/[;,/]/)
    .map(p => p.trim())
    .filter(Boolean);

const ImportExcelTasksTab: React.FC<ImportExcelTasksTabProps> = ({
  coordinationId,
  activeDay,
  startPosition = 0,
  premiumAction,
  onImported,
  onClose,
}) => {
  const { t } = useTranslation('monJourM');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ParsedTaskRow[]>([]);
  const [existingMembers, setExistingMembers] = useState<{ id: string; name: string }[]>([]);
  const [newPeopleRoles, setNewPeopleRoles] = useState<Record<string, string>>({});
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const validRows = useMemo(() => rows.filter(r => r.valid), [rows]);

  const newPeople = useMemo(() => {
    const existing = new Set(existingMembers.map(m => normalizeKey(m.name)));
    const found = new Map<string, string>();
    validRows.forEach(row => {
      row.people.forEach(person => {
        const key = normalizeKey(person);
        if (!existing.has(key) && !found.has(key)) found.set(key, person);
      });
    });
    return Array.from(found.values());
  }, [validRows, existingMembers]);

  const handleDownloadTemplate = () => {
    const headers = [
      t('importExcel.columns.time'),
      t('importExcel.columns.title'),
      t('importExcel.columns.duration'),
      t('importExcel.columns.people'),
      t('importExcel.columns.description'),
    ];
    const sample = [
      ['15:00', t('importExcel.sample.row1Title'), 30, 'Marie Dupont', t('importExcel.sample.row1Desc')],
      ['15:30', t('importExcel.sample.row2Title'), 45, 'Marie Dupont; Paul Martin', ''],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sample]);
    worksheet['!cols'] = [{ wch: 10 }, { wch: 32 }, { wch: 14 }, { wch: 30 }, { wch: 40 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning');
    XLSX.writeFile(workbook, 'modele-planning-jour-m.xlsx');
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

      const parsed: ParsedTaskRow[] = raw.map(record => {
        const mapped: Record<string, unknown> = {};
        Object.entries(record).forEach(([header, value]) => {
          const field = COLUMN_ALIASES[normalizeKey(header)];
          if (field) mapped[field] = value;
        });

        const title = (mapped.title ?? '').toString().trim();
        const time = parseTimeCell(mapped.time);
        const durationRaw = parseInt((mapped.duration ?? '').toString(), 10);
        const duration = Number.isFinite(durationRaw) && durationRaw >= 5 ? durationRaw : 30;

        let error: string | undefined;
        if (!title) error = t('importExcel.errors.missingTitle');
        else if (!time) error = t('importExcel.errors.invalidTime');

        return {
          time,
          title,
          duration,
          people: splitPeople(mapped.people),
          description: (mapped.description ?? '').toString().trim(),
          valid: !error,
          error,
        };
      }).filter(row => row.title || row.time);

      const { data: team, error: teamError } = await supabase
        .from('coordination_team')
        .select('id, name')
        .eq('coordination_id', coordinationId);
      if (teamError) throw teamError;

      setExistingMembers(team || []);
      setRows(parsed);
      setFileName(file.name);
      setNewPeopleRoles({});

      if (parsed.length === 0) {
        toast({
          title: t('importExcel.toast.emptyTitle'),
          description: t('importExcel.toast.emptyDesc'),
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('❌ Excel parse error:', err);
      toast({
        title: t('importExcel.toast.parseErrorTitle'),
        description: t('importExcel.toast.parseErrorDesc'),
        variant: 'destructive',
      });
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImport = () => {
    if (validRows.length === 0) return;

    premiumAction.executeAction(async () => {
      setIsImporting(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) throw new Error('session');

        // 1. Créer les personnes manquantes dans l'équipe
        const nameToId = new Map<string, string>();
        existingMembers.forEach(m => nameToId.set(normalizeKey(m.name), m.id));

        if (newPeople.length > 0) {
          const payload = newPeople.map(name => ({
            coordination_id: coordinationId,
            name,
            role: newPeopleRoles[name] || 'Autre personne',
            type: (newPeopleRoles[name] || '').startsWith('Prestataires :')
              || newPeopleRoles[name] === 'Autre prestataire' ? 'vendor' : 'person',
          }));

          const { data: created, error: teamError } = await supabase
            .from('coordination_team')
            .insert(payload)
            .select('id, name');
          if (teamError) throw teamError;

          (created || []).forEach(m => nameToId.set(normalizeKey(m.name), m.id));
        }

        // 2. Créer les étapes
        const tasks = validRows.map((row, index) => ({
          coordination_id: coordinationId,
          title: row.title,
          description: row.description || null,
          start_time: row.time,
          duration: row.duration,
          category: 'jour-m',
          priority: 'medium',
          position: startPosition + index,
          event_day: activeDay || 'Jour J',
          assigned_to: row.people
            .map(p => nameToId.get(normalizeKey(p)))
            .filter((id): id is string => Boolean(id)),
        }));

        const { error: tasksError } = await supabase
          .from('coordination_planning')
          .insert(tasks);
        if (tasksError) throw tasksError;

        toast({
          title: t('importExcel.toast.successTitle'),
          description: t('importExcel.toast.successDesc', {
            steps: tasks.length,
            people: newPeople.length,
          }),
        });

        setRows([]);
        setFileName(null);
        onImported();
        onClose();
      } catch (err) {
        console.error('❌ Excel import error:', err);
        toast({
          title: t('importExcel.toast.importErrorTitle'),
          description: t('importExcel.toast.importErrorDesc'),
          variant: 'destructive',
        });
      } finally {
        setIsImporting(false);
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">{t('importExcel.intro')}</p>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button type="button" variant="outline" onClick={handleDownloadTemplate} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          {t('importExcel.downloadTemplate')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isParsing}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isParsing ? t('importExcel.reading') : t('importExcel.chooseFile')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {fileName && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileSpreadsheet className="h-4 w-4" />
          <span className="truncate">{fileName}</span>
          <Badge variant="secondary">{t('importExcel.validCount', { count: validRows.length })}</Badge>
          {rows.length - validRows.length > 0 && (
            <Badge variant="outline" className="text-red-600 border-red-300">
              {t('importExcel.ignoredCount', { count: rows.length - validRows.length })}
            </Badge>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <div className="border rounded-md max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left p-2">{t('importExcel.columns.time')}</th>
                <th className="text-left p-2">{t('importExcel.columns.title')}</th>
                <th className="text-left p-2">{t('importExcel.columns.duration')}</th>
                <th className="text-left p-2">{t('importExcel.columns.people')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className={row.valid ? '' : 'bg-red-50'}>
                  <td className="p-2 whitespace-nowrap">{row.time || '—'}</td>
                  <td className="p-2">
                    {row.title || '—'}
                    {!row.valid && (
                      <span className="flex items-center gap-1 text-xs text-red-600 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {row.error}
                      </span>
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">{row.duration}</td>
                  <td className="p-2 text-muted-foreground">{row.people.join(', ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {newPeople.length > 0 && (
        <div className="border rounded-md p-3 space-y-3 bg-muted/30">
          <div className="flex items-center gap-2 text-sm font-medium">
            <UserPlus className="h-4 w-4" />
            {t('importExcel.newPeopleTitle', { count: newPeople.length })}
          </div>
          <p className="text-xs text-muted-foreground">{t('importExcel.newPeopleDesc')}</p>
          <div className="space-y-2">
            {newPeople.map(person => (
              <div key={person} className="flex items-center gap-2">
                <span className="flex-1 text-sm truncate">{person}</span>
                <Select
                  value={newPeopleRoles[person] || 'Autre personne'}
                  onValueChange={(value) => setNewPeopleRoles(prev => ({ ...prev, [person]: value }))}
                >
                  <SelectTrigger className="w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_ROLES.map(role => (
                      <SelectItem key={role} value={role}>
                        {t(`team.roles.${role}`, role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={isImporting}>
          {t('taskModal.buttons.cancel')}
        </Button>
        <Button type="button" onClick={handleImport} disabled={validRows.length === 0 || isImporting}>
          {isImporting
            ? t('importExcel.importing')
            : t('importExcel.importButton', { count: validRows.length })}
        </Button>
      </div>
    </div>
  );
};

export default ImportExcelTasksTab;
