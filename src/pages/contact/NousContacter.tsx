import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import Footer from '@/components/Footer';
import { Mail, Send, User, Building, Briefcase, Heart, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const NousContacter = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    email: '',
    phone: '',
    message: ''
  });

  const typeOptions = [
    { value: 'couple', label: 'Je suis un couple', icon: Heart },
    { value: 'lieu', label: 'Je suis un lieu', icon: Building },
    { value: 'marque', label: 'Je suis une marque', icon: Briefcase },
    { value: 'prestataire', label: 'Je suis un prestataire', icon: User }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.email || !formData.message) {
      toast({ title: "Formulaire incomplet", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_requests').insert({
        type: formData.type,
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        message: formData.message.trim()
      });
      if (error) throw error;
      toast({ title: "Message envoyé !", description: "Nous vous répondrons dans les plus brefs délais." });
      setFormData({ type: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({ title: "Erreur", description: "Une erreur est survenue. Veuillez réessayer.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact & Notre Histoire | Mariable</title>
        <meta name="description" content="Découvrez l'histoire de Mariable, fondée par Mathilde, et contactez notre équipe pour toute question sur l'organisation de votre mariage." />
        <link rel="canonical" href="https://www.mariable.fr/contact" />
      </Helmet>

      <div className="min-h-screen bg-white text-editorial-noir">
        <EditorialHeader />

        <main>
          {/* Hero éditorial */}
          <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-wedding-olive mb-6">
                Notre histoire &amp; contact
              </p>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
                Faisons connaissance — <em className="italic">et échangeons.</em>
              </h1>
              <p className="text-editorial-noir/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                L'histoire d'une jeune mariée qui a décidé de tout changer,
                et une équipe à votre écoute.
              </p>
            </div>
          </section>

          {/* Portrait fondatrice */}
          <section className="py-12 md:py-20 bg-[#F8F5EF]">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/photomathilde.png"
                    alt="Mathilde, fondatrice de Mariable"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive mb-4">Rencontre</p>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
                    Mathilde, <em className="italic">fondatrice.</em>
                  </h2>
                  <div className="space-y-4 text-editorial-noir/80 leading-relaxed">
                    <p>
                      L'histoire de Mariable commence avec Mathilde, jeune mariée diplômée
                      d'école de commerce, qui décide de se lancer dans l'entrepreneuriat
                      après son expérience personnelle.
                    </p>
                    <p>
                      Une conviction simple : l'organisation d'un mariage devrait être
                      un moment de joie, pas une charge mentale. Mariable est né de ce constat —
                      pour digitaliser, alléger, et rendre le processus enfin agréable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission / Vision */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                <div className="border-t-2 border-wedding-olive pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-5 h-5 text-wedding-olive" strokeWidth={1.5} />
                    <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive">Notre mission</p>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                    Célébrer l'amour — <em className="italic">simplement.</em>
                  </h3>
                  <p className="text-editorial-noir/75 leading-relaxed">
                    Apporter de la joie et transformer l'organisation des mariages
                    en une expérience simple et agréable, pour tous les couples.
                  </p>
                </div>
                <div className="border-t-2 border-wedding-olive pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-wedding-olive" strokeWidth={1.5} />
                    <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive">Notre vision</p>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                    Faciliter <em className="italic">le plus beau jour de votre vie.</em>
                  </h3>
                  <p className="text-editorial-noir/75 leading-relaxed">
                    Transformer l'organisation des mariages en une expérience
                    simple, moderne et accessible à tous.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chiffres-clés */}
          <section className="py-16 md:py-20 bg-[#F8F5EF]">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
                {[
                  { n: '2000+', l: 'Couples accompagnés' },
                  { n: '500+', l: 'Prestataires sélectionnés' },
                  { n: '100%', l: 'Sans sponsoring' },
                  { n: '29€', l: 'Premium à vie' },
                ].map((k) => (
                  <div key={k.l}>
                    <p className="font-serif text-4xl md:text-5xl text-editorial-noir mb-2">{k.n}</p>
                    <p className="text-xs tracking-[0.2em] uppercase text-editorial-noir/60">{k.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Formulaire de contact */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive mb-4">Contact</p>
                  <h2 className="font-serif text-3xl md:text-5xl mb-4">
                    Au plaisir <em className="italic">d'échanger avec vous.</em>
                  </h2>
                  <p className="text-editorial-noir/70">
                    Une question, un projet, un partenariat ? Écrivez-nous.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-[#F8F5EF] border border-editorial-noir/10 p-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">
                      Vous êtes <span className="text-wedding-olive">*</span>
                    </label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="w-full rounded-none bg-white">
                        <SelectValue placeholder="Sélectionnez votre profil" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">
                      Email <span className="text-wedding-olive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-noir/40" />
                      <Input type="email" value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com" className="pl-10 rounded-none bg-white" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-noir/40" />
                      <Input type="tel" value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="06 12 34 56 78" className="pl-10 rounded-none bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">
                      Message <span className="text-wedding-olive">*</span>
                    </label>
                    <Textarea value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Comment pouvons-nous vous aider ?" rows={5}
                      className="rounded-none bg-white" required />
                  </div>

                  <Button type="submit" disabled={isSubmitting}
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white rounded-none py-6">
                    {isSubmitting ? 'Envoi en cours...' : (
                      <><Send className="w-4 h-4 mr-2" /> Envoyer le message</>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center text-editorial-noir/70">
                  <p className="mb-4 text-sm">Ou directement :</p>
                  <a href="mailto:mathilde@mariable.fr" className="text-wedding-olive hover:underline">
                    mathilde@mariable.fr
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NousContacter;
