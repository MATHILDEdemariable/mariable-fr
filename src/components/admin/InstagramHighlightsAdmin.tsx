import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Plus, ExternalLink } from 'lucide-react';

interface Highlight {
  id: string;
  instagram_url: string;
  image_url: string;
  caption: string | null;
  prestataire_id: string | null;
  context: 'blog' | 'professionnels' | 'both';
  display_order: number;
  active: boolean;
}

const emptyForm = {
  instagram_url: '',
  image_url: '',
  caption: '',
  prestataire_id: '',
  context: 'both' as const,
  display_order: 0,
  active: true,
};

const InstagramHighlightsAdmin = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: highlights = [], isLoading } = useQuery({
    queryKey: ['admin-instagram-highlights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instagram_highlights')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Highlight[];
    },
  });

  const { data: prestataires = [] } = useQuery({
    queryKey: ['admin-prestataires-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestataires_rows')
        .select('id, nom')
        .eq('visible', true)
        .order('nom')
        .limit(500);
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        instagram_url: form.instagram_url.trim(),
        image_url: form.image_url.trim(),
        caption: form.caption.trim() || null,
        prestataire_id: form.prestataire_id || null,
        context: form.context,
        display_order: Number(form.display_order) || 0,
        active: form.active,
      };
      if (editingId) {
        const { error } = await supabase.from('instagram_highlights').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('instagram_highlights').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? 'Sélection mise à jour' : 'Sélection ajoutée');
      qc.invalidateQueries({ queryKey: ['admin-instagram-highlights'] });
      qc.invalidateQueries({ queryKey: ['instagram-highlights'] });
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e: any) => toast.error(e.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('instagram_highlights').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Supprimé');
      qc.invalidateQueries({ queryKey: ['admin-instagram-highlights'] });
      qc.invalidateQueries({ queryKey: ['instagram-highlights'] });
    },
  });

  const startEdit = (h: Highlight) => {
    setEditingId(h.id);
    setForm({
      instagram_url: h.instagram_url,
      image_url: h.image_url,
      caption: h.caption || '',
      prestataire_id: h.prestataire_id || '',
      context: h.context,
      display_order: h.display_order,
      active: h.active,
    });
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Modifier la sélection' : 'Ajouter une sélection Instagram'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>URL du post Instagram *</Label>
              <Input
                placeholder="https://www.instagram.com/p/..."
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              />
            </div>
            <div>
              <Label>URL de la miniature (image) *</Label>
              <Input
                placeholder="https://... (uploadez d'abord dans un bucket)"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Légende (optionnel)</Label>
            <Textarea
              rows={2}
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Prestataire lié (optionnel)</Label>
              <Select
                value={form.prestataire_id || 'none'}
                onValueChange={(v) => setForm({ ...form, prestataire_id: v === 'none' ? '' : v })}
              >
                <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {prestataires.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>{p.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contexte d'affichage</Label>
              <Select value={form.context} onValueChange={(v: any) => setForm({ ...form, context: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Blog + Professionnels</SelectItem>
                  <SelectItem value="blog">Blog uniquement</SelectItem>
                  <SelectItem value="professionnels">Professionnels uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ordre d'affichage</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
            <Label>Actif (visible sur le site)</Label>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={!form.instagram_url || !form.image_url || saveMutation.isPending}
              className="bg-wedding-olive hover:bg-wedding-olive/90"
            >
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={cancelEdit}>Annuler</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sélections existantes ({highlights.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Chargement...</p>
          ) : highlights.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune sélection pour le moment.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {highlights.map((h) => (
                <div key={h.id} className="border rounded overflow-hidden group relative">
                  <img src={h.image_url} alt="" className="w-full aspect-square object-cover" />
                  <div className="p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 bg-editorial-beige rounded">{h.context}</span>
                      {!h.active && <span className="text-[10px] text-red-600">inactif</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground">Ordre: {h.display_order}</p>
                  </div>
                  <div className="absolute inset-x-0 top-0 flex justify-between p-1 opacity-0 group-hover:opacity-100 transition">
                    <a href={h.instagram_url} target="_blank" rel="noopener noreferrer"
                       className="bg-white/90 p-1 rounded">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex gap-1">
                      <Button size="sm" variant="secondary" className="h-6 px-2 text-[10px]" onClick={() => startEdit(h)}>
                        Éditer
                      </Button>
                      <Button size="sm" variant="destructive" className="h-6 w-6 p-0"
                        onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(h.id); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstagramHighlightsAdmin;
