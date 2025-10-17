import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const DemoRequestForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: '',
    message: '',
    rgpdConsent: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rgpdConsent) {
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter la politique de confidentialité",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('professional_payment_leads')
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          message: formData.message,
          rgpd_consent: formData.rgpdConsent
        }]);

      if (error) throw error;

      toast({
        title: "Demande reçue ! ✅",
        description: "Mathilde vous contactera sous 24h.",
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        category: '',
        message: '',
        rgpdConsent: false
      });
    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo-form" className="max-w-2xl mx-auto mb-16 scroll-mt-24">
      <Card className="p-8">
        <h2 className="text-2xl font-serif mb-2 text-center">Je veux une démo & plus d'information</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Remplissez ce formulaire et nous vous recontactons sous 24h
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nom complet *</Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <Label htmlFor="email">Email professionnel *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="contact@monentreprise.fr"
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="06 12 34 56 78"
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre activité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lieu">Lieu de réception</SelectItem>
                <SelectItem value="Traiteur">Traiteur</SelectItem>
                <SelectItem value="Photo">Photographe</SelectItem>
                <SelectItem value="DJ">DJ / Musicien</SelectItem>
                <SelectItem value="Planner">Wedding Planner</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message / Besoins spécifiques (optionnel)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Décrivez vos besoins en quelques mots..."
              rows={4}
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="rgpd"
              checked={formData.rgpdConsent}
              onCheckedChange={(checked) => setFormData({...formData, rgpdConsent: checked as boolean})}
            />
            <Label htmlFor="rgpd" className="text-xs leading-tight cursor-pointer">
              J'accepte que mes données soient utilisées pour me recontacter dans le cadre de ma demande de démo. *
            </Label>
          </div>

          <Button type="submit" className="w-full bg-wedding-olive hover:bg-wedding-olive/90" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Demander une démo gratuite'}
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default DemoRequestForm;
