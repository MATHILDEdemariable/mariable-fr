import React, { useEffect, useState } from 'react';
import { ExternalLink, Plus, Trash2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type InspirationLink = { id: string; title: string; pinterest_url: string };

/** Liens d'inspiration (Pinterest, Drive, moodboard) partagés pour un mariage — réutilise coordination_pinterest. */
const InspirationLinksPanel = ({ coordinationId, isEnglish }: { coordinationId: string; isEnglish: boolean }) => {
  const [inspirationLinks, setInspirationLinks] = useState<InspirationLink[]>([]);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const loadInspirationLinks = async () => {
    const { data, error } = await supabase.from('coordination_pinterest')
      .select('id, title, pinterest_url').eq('coordination_id', coordinationId).order('created_at');
    if (error) { console.error('❌ loadInspirationLinks failed:', error); return; }
    setInspirationLinks(data || []);
  };

  useEffect(() => { loadInspirationLinks(); }, [coordinationId]);

  const handleAddLink = async () => {
    let url = linkUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const { error } = await supabase.from('coordination_pinterest').insert({
      coordination_id: coordinationId, pinterest_url: url, title: linkTitle.trim() || (isEnglish ? 'Inspiration' : 'Inspiration'),
    });
    if (error) { console.error('❌ addInspirationLink failed:', error); return; }
    setLinkTitle(''); setLinkUrl('');
    loadInspirationLinks();
  };

  const handleDeleteLink = async (linkId: string) => {
    const { error } = await supabase.from('coordination_pinterest').delete().eq('id', linkId);
    if (error) { console.error('❌ deleteInspirationLink failed:', error); return; }
    loadInspirationLinks();
  };

  return (
    <div className="border border-border bg-card p-4 rounded-none space-y-3">
      <h2 className="font-serif text-lg flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        {isEnglish ? 'Inspiration links (Pinterest, Drive, moodboard)' : 'Liens inspirations (Pinterest, Drive, moodboard)'}
      </h2>
      {inspirationLinks.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {inspirationLinks.map((link) => (
            <li key={link.id} className="inline-flex items-center gap-1 border border-border px-3 py-1.5 text-sm">
              <a href={link.pinterest_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary">
                {link.title} <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button onClick={() => handleDeleteLink(link.id)} aria-label={isEnglish ? 'Delete' : 'Supprimer'} className="text-muted-foreground hover:text-destructive ml-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input placeholder={isEnglish ? 'Name (e.g. Table decor)' : 'Nom (ex. Déco de table)'} value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} className="sm:w-48" />
        <Input placeholder="https://pinterest.com/…" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
        <Button onClick={handleAddLink} disabled={!linkUrl.trim()} className="rounded-none min-h-[40px]">
          <Plus className="h-4 w-4 mr-1" /> {isEnglish ? 'Add' : 'Ajouter'}
        </Button>
      </div>
    </div>
  );
};

export default InspirationLinksPanel;
