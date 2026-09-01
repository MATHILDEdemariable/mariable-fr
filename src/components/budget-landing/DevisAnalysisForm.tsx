import React, { useState } from 'react';
import { z } from 'zod';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const CATEGORIES = [
  'Lieu de réception',
  'Traiteur',
  'Photographe',
  'Vidéaste',
  'Fleuriste',
  'DJ',
  'Wedding planner',
  'Décoration',
  'Autre',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const devisSchema = z.object({
  email: z.string().trim().email({ message: 'Adresse email invalide' }).max(255),
  categorie: z.string().trim().min(1, { message: 'Choisissez une catégorie' }),
  commentaire: z.string().trim().max(1000, { message: 'Commentaire trop long (1000 caractères max)' }),
});

const DevisAnalysisForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [categorie, setCategorie] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('🚀 DevisAnalysisForm submit started');

    const parsed = devisSchema.safeParse({ email, categorie, commentaire });
    if (!parsed.success) {
      toast({
        title: 'Formulaire incomplet',
        description: parsed.error.errors[0]?.message ?? 'Vérifiez les champs saisis',
        variant: 'destructive',
      });
      return;
    }

    if (!file) {
      toast({
        title: 'Devis manquant',
        description: 'Ajoutez votre devis au format PDF, JPG ou PNG.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'Fichier trop lourd', description: '10 Mo maximum.', variant: 'destructive' });
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({ title: 'Format non supporté', description: 'PDF, JPG ou PNG uniquement.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);

      const extension = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
      const filePath = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('devis-analyses')
        .upload(filePath, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('devis_analyses').insert({
        email: parsed.data.email,
        categorie: parsed.data.categorie,
        commentaire: parsed.data.commentaire || null,
        file_path: filePath,
      });

      if (insertError) throw insertError;

      supabase.functions
        .invoke('notify-devis-analyse', {
          body: {
            email: parsed.data.email,
            categorie: parsed.data.categorie,
            commentaire: parsed.data.commentaire,
            filePath,
          },
        })
        .catch((notifyError) => console.error('❌ notify-devis-analyse failed:', notifyError));

      console.log('✅ DevisAnalysisForm submit completed');
      setIsSent(true);
    } catch (error: any) {
      console.error('❌ DevisAnalysisForm submit failed:', error);
      toast({
        title: 'Envoi impossible',
        description: error?.message || 'Réessayez dans quelques instants.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="border border-editorial-noir/15 bg-white p-8 md:p-10 text-center">
        <CheckCircle2 className="w-10 h-10 text-wedding-olive mx-auto" aria-hidden="true" />
        <p className="font-serif text-2xl text-editorial-noir mt-4">Devis bien reçu</p>
        <p className="mt-3 text-editorial-noir/70 leading-relaxed">
          Nous revenons vers vous sous 48h avec notre lecture du devis : postes à challenger,
          repères de prix et questions à poser à votre prestataire.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-editorial-noir/15 bg-white p-6 md:p-10 space-y-6">
      <div>
        <label htmlFor="devis-email" className="block text-[11px] tracking-[0.25em] uppercase text-editorial-noir/60 mb-2">
          Votre email
        </label>
        <input
          id="devis-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
          placeholder="vous@email.com"
          className="w-full border border-editorial-noir/20 rounded-none px-4 py-3 text-base bg-white focus:outline-none focus:border-wedding-olive min-h-[44px]"
        />
      </div>

      <div>
        <label htmlFor="devis-categorie" className="block text-[11px] tracking-[0.25em] uppercase text-editorial-noir/60 mb-2">
          Catégorie du prestataire
        </label>
        <select
          id="devis-categorie"
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
          className="w-full border border-editorial-noir/20 rounded-none px-4 py-3 text-base bg-white focus:outline-none focus:border-wedding-olive min-h-[44px]"
        >
          <option value="">Choisir une catégorie</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="devis-file" className="block text-[11px] tracking-[0.25em] uppercase text-editorial-noir/60 mb-2">
          Votre devis (PDF, JPG ou PNG — 10 Mo max)
        </label>
        <div className="flex items-center gap-3 border border-dashed border-editorial-noir/30 px-4 py-4">
          <UploadCloud className="w-5 h-5 text-wedding-olive shrink-0" aria-hidden="true" />
          <input
            id="devis-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-editorial-noir/80"
          />
        </div>
      </div>

      <div>
        <label htmlFor="devis-commentaire" className="block text-[11px] tracking-[0.25em] uppercase text-editorial-noir/60 mb-2">
          Contexte (optionnel)
        </label>
        <textarea
          id="devis-commentaire"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Date, nombre d'invités, région, ce qui vous interroge dans ce devis…"
          className="w-full border border-editorial-noir/20 rounded-none px-4 py-3 text-base bg-white focus:outline-none focus:border-wedding-olive"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-10 py-4 uppercase tracking-widest text-xs rounded-none transition-colors min-h-[44px] disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        <span>{isSubmitting ? 'Envoi en cours' : 'Envoyer mon devis'}</span>
      </button>

      <p className="text-xs text-editorial-noir/55 leading-relaxed">
        Analyse gratuite et confidentielle. Votre devis n'est jamais transmis à un autre prestataire.
      </p>
    </form>
  );
};

export default DevisAnalysisForm;
