import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const VALID_ROLES = [
  'Mariés', 'Témoins', 'Amis', 'Famille', 'Co-organisateur',
  'Prestataires : Lieux', 'Prestataires : Traiteur', 'Prestataires : Coordinateur',
  'Prestataires : Photographe', 'Autre prestataire', 'Autre personne',
];

interface ParsedRow {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  roleAdjusted: boolean;
  valid: boolean;
}

interface BulkAddTeamModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinationId: string;
  onAdded: () => void;
}

const normalizeRole = (input: string): { role: string; adjusted: boolean } => {
  const trimmed = (input || '').trim();
  if (!trimmed) return { role: 'Autre personne', adjusted: true };
  const exact = VALID_ROLES.find(r => r.toLowerCase() === trimmed.toLowerCase());
  if (exact) return { role: exact, adjusted: false };
  const partial = VALID_ROLES.find(r => r.toLowerCase().includes(trimmed.toLowerCase()));
  if (partial) return { role: partial, adjusted: true };
  return { role: 'Autre personne', adjusted: true };
};

const parseLines = (text: string): ParsedRow[] =>
  text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    const [name = '', roleRaw = '', email = '', phone = ''] = parts;
    const { role, adjusted } = normalizeRole(roleRaw);
    return {
      name,
      role,
      email: email || undefined,
      phone: phone || undefined,
      roleAdjusted: adjusted,
      valid: Boolean(name),
    };
  });

const BulkAddTeamModal: React.FC<BulkAddTeamModalProps> = ({ open, onOpenChange, coordinationId, onAdded }) => {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const rows = useMemo(() => parseLines(text), [text]);
  const validRows = rows.filter(r => r.valid);

  const handleImport = async () => {
    if (validRows.length === 0) return;
    setIsSaving(true);
    try {
      const payload = validRows.map(r => ({
        coordination_id: coordinationId,
        name: r.name,
        role: r.role,
        email: r.email || null,
        phone: r.phone || null,
        type: r.role.startsWith('Prestataires :') || r.role === 'Autre prestataire' ? 'vendor' : 'person',
      }));
      const { error } = await supabase.from('coordination_team').insert(payload);
      if (error) throw error;
      toast({ title: 'Équipe importée', description: `${validRows.length} membre(s) ajouté(s).` });
      setText('');
      onAdded();
      onOpenChange(false);
    } catch (e) {
      console.error('❌ Bulk import team error:', e);
      toast({ title: 'Erreur', description: "Import impossible", variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajout en masse de membres</DialogTitle>
          <DialogDescription>
            Une ligne par membre. Format : <code>Nom Prénom, Rôle, email (optionnel), téléphone (optionnel)</code>
          </DialogDescription>
        </DialogHeader>

        <Textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Marie Dupont, Témoins, marie@mail.com, 06 12 34 56 78
Paul Martin, Famille
Sophie L., Co-organisateur, sophie@mail.com
Atelier Photo, Prestataires : Photographe`}
          className="font-mono text-sm"
        />

        {rows.length > 0 && (
          <div className="border rounded-md max-h-60 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Rôle</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Tél.</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className={!r.valid ? 'bg-red-50' : ''}>
                    <td className="p-2">{r.name || <span className="text-red-600">— manquant</span>}</td>
                    <td className="p-2">
                      {r.role}
                      {r.roleAdjusted && <Badge variant="secondary" className="ml-2 text-xs">ajusté</Badge>}
                    </td>
                    <td className="p-2 text-muted-foreground">{r.email || '—'}</td>
                    <td className="p-2 text-muted-foreground">{r.phone || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Annuler</Button>
          <Button onClick={handleImport} disabled={validRows.length === 0 || isSaving}>
            {isSaving ? 'Import…' : `Importer ${validRows.length} membre(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAddTeamModal;
