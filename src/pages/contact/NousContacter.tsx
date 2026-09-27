import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import Footer from '@/components/Footer';
import { Mail, Send, User, Building, Briefcase, Heart, Phone, Sparkles, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const LINKEDIN_URL = 'https://www.linkedin.com/in/lambertmathilde/';

type TimelineStep = { year: string; title: string; body: string };

const NousContacter = () => {
  const { toast } = useToast();
  const { t } = useTranslation('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ type: '', email: '', phone: '', message: '' });

  const typeOptions = [
    { value: 'couple', icon: Heart },
    { value: 'lieu', icon: Building },
    { value: 'marque', icon: Briefcase },
    { value: 'prestataire', icon: User },
  ];
  const timelineSteps = t('timeline.steps', { returnObjects: true }) as TimelineStep[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.email || !formData.message) {
      toast({ title: t('form.incompleteTitle'), description: t('form.incompleteDesc'), variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_requests').insert({
        type: formData.type,
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        message: formData.message.trim(),
      });
      if (error) throw error;
      toast({ title: t('form.successTitle'), description: t('form.successDesc') });
      setFormData({ type: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({ title: t('form.errorTitle'), description: t('form.errorDesc'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="canonical" href="https://mariable.fr/contact" />
      </Helmet>

      <div className="min-h-screen bg-white text-editorial-noir">
        <EditorialHeader />

        <main>
          <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-wedding-olive mb-6">{t('hero.eyebrow')}</p>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.05]">
                {t('hero.title')} <em className="italic">{t('hero.titleEm')}</em>
              </h1>
            </div>
          </section>

          <section className="py-12 md:py-20 bg-[#F8F5EF]">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/photomathilde.png"
                    alt={t('story.imageAlt')}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive mb-4">{t('story.eyebrow')}</p>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
                    {t('story.title')} <em className="italic">{t('story.titleEm')}</em>
                  </h2>
                  <div className="space-y-4 text-editorial-noir/80 leading-relaxed">
                    <p>{t('story.p1')}</p>
                    <p>{t('story.p2')}</p>
                    <p>{t('story.p3')}</p>
                  </div>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 border border-editorial-noir px-5 py-3 text-xs uppercase tracking-[0.2em] hover:bg-editorial-noir hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                    {t('story.linkedin')}
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Frise chronologique */}
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
              <p className="text-xs tracking-[0.3em] uppercase text-wedding-olive mb-10">{t('timeline.eyebrow')}</p>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                {timelineSteps.map((step) => (
                  <li key={step.year}>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="h-3 w-3 shrink-0 rounded-full bg-wedding-olive" aria-hidden="true" />
                      <span className="h-px flex-1 bg-editorial-noir/15" aria-hidden="true" />
                    </div>
                    <p className="font-serif text-4xl md:text-5xl text-wedding-olive mb-4">{step.year}</p>
                    <h3 className="uppercase text-lg tracking-wide mb-3">{step.title}</h3>
                    <p className="text-sm text-editorial-noir/65 leading-relaxed">{step.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-[#F8F5EF]">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                <div className="border-t-2 border-wedding-olive pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-5 h-5 text-wedding-olive" strokeWidth={1.5} />
                    <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive">{t('mission.missionLabel')}</p>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                    {t('mission.missionTitle')} <em className="italic">{t('mission.missionEm')}</em>
                  </h3>
                  <p className="text-editorial-noir/75 leading-relaxed">{t('mission.missionBody')}</p>
                </div>
                <div className="border-t-2 border-wedding-olive pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-wedding-olive" strokeWidth={1.5} />
                    <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive">{t('mission.visionLabel')}</p>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                    {t('mission.visionTitle')} <em className="italic">{t('mission.visionEm')}</em>
                  </h3>
                  <p className="text-editorial-noir/75 leading-relaxed">{t('mission.visionBody')}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive mb-4">{t('form.eyebrow')}</p>
                  <h2 className="font-serif text-3xl md:text-5xl mb-4">
                    {t('form.title')} <em className="italic">{t('form.titleEm')}</em>
                  </h2>
                  <p className="text-editorial-noir/70">{t('form.intro')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-[#F8F5EF] border border-editorial-noir/10 p-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">
                      {t('form.typeLabel')} <span className="text-wedding-olive">*</span>
                    </label>
                    <Select value={formData.type} onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}>
                      <SelectTrigger className="w-full rounded-none bg-white">
                        <SelectValue placeholder={t('form.typePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="w-4 h-4" />
                              {t(`form.types.${option.value}`)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">
                      {t('form.email')} <span className="text-wedding-olive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-noir/40" />
                      <Input type="email" value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder={t('form.emailPlaceholder')} className="pl-10 rounded-none bg-white" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">{t('form.phone')}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-noir/40" />
                      <Input type="tel" value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="06 12 34 56 78" className="pl-10 rounded-none bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-editorial-noir">
                      {t('form.message')} <span className="text-wedding-olive">*</span>
                    </label>
                    <Textarea value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder={t('form.messagePlaceholder')} rows={5}
                      className="rounded-none bg-white" required />
                  </div>

                  <Button type="submit" disabled={isSubmitting}
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white rounded-none py-6">
                    {isSubmitting ? t('form.sending') : (<><Send className="w-4 h-4 mr-2" /> {t('form.submit')}</>)}
                  </Button>
                </form>

                <div className="mt-8 text-center text-editorial-noir/70">
                  <p className="mb-4 text-sm">{t('form.or')}</p>
                  <a href="mailto:mathilde@mariable.fr" className="text-wedding-olive hover:underline">mathilde@mariable.fr</a>
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
