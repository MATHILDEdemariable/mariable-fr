import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Handshake, 
  Users, 
  TrendingUp, 
  Calendar, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Heart,
  Target,
  Zap,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const partnershipSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  company_name: z.string().max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères").optional(),
  phone: z.string().max(20, "Le téléphone ne peut pas dépasser 20 caractères").optional(),
  message: z.string().max(1000, "Le message ne peut pas dépasser 1000 caractères").optional()
});

const Partenariat = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate
      const validated = partnershipSchema.parse(formData);
      
      setIsSubmitting(true);

      const { error } = await supabase
        .from('partnership_requests')
        .insert([{
          name: validated.name,
          email: validated.email,
          company_name: validated.company_name || null,
          phone: validated.phone || null,
          message: validated.message || null
        }]);

      if (error) throw error;

      toast.success('Demande envoyée avec succès!', {
        description: 'Nous reviendrons vers vous rapidement.'
      });

      setFormData({
        name: '',
        email: '',
        company_name: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error('Erreur de validation', {
          description: error.errors[0].message
        });
      } else {
        console.error('Error submitting partnership request:', error);
        toast.error('Une erreur est survenue', {
          description: 'Veuillez réessayer plus tard.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Programme Partenariat | Mariable</title>
        <meta 
          name="description" 
          content="Rejoignez notre réseau de partenaires premium et offrez à vos clients une expérience de planification de mariage exceptionnelle avec Mariable." 
        />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-b from-premium-cream via-white to-premium-warm">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-br from-premium-sage via-premium-cream to-white py-20 px-4"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm"
              >
                <Handshake className="w-5 h-5 text-wedding-olive" />
                <span className="text-sm font-medium text-wedding-olive">Programme Partenariat</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-serif text-wedding-black leading-tight">
                Devenez partenaire
                <span className="block text-wedding-olive mt-2">Mariable</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-wedding-black/70 max-w-3xl mx-auto font-light">
                Rejoignez le réseau de référence pour les mariages d'excellence et offrez une expérience premium à vos clients
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Section Présentation Mariable */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-serif text-wedding-black">
                    Mariable.fr, la plateforme intelligente pour organiser son mariage
                  </h2>
                  <p className="text-lg text-wedding-black/70 leading-relaxed">
                    Une solution complète qui facilite l'organisation de mariage grâce à des outils intelligents et un guide de prestataires de confiance et haut de gamme.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { icon: Users, text: "Gérer les réponses invités et plan de table" },
                    { icon: TrendingUp, text: "Suivre le budget en temps réel" },
                    { icon: FileText, text: "Centraliser hébergements et documents" },
                    { icon: Calendar, text: "Créer le planning du jour J" },
                    { icon: Zap, text: "Partager avec prestataires et proches (sans téléchargement)" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-premium-warm rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-full bg-wedding-olive/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-wedding-olive" />
                      </div>
                      <span className="text-wedding-black font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2 Options */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-premium-cream">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-wedding-black mb-4">
                2 Options de Partenariat
              </h2>
              <p className="text-xl text-wedding-black/70">
                Choisissez la formule qui correspond à vos besoins
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Option 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-xl p-8 border-2 border-premium-sage/20 hover:border-wedding-olive transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-premium-sage/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-wedding-olive" />
                  </div>
                  <h3 className="text-2xl font-serif text-wedding-black">Option 1</h3>
                </div>
                
                <div className="bg-premium-sage/10 rounded-2xl p-6 mb-6">
                  <p className="text-3xl font-bold text-wedding-olive mb-2">Gratuite</p>
                  <p className="text-wedding-black/70">Échange de visibilité</p>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    "Recommandation mutuelle sur nos sites",
                    "Partage sur nos réseaux sociaux",
                    "Visibilité auprès de +500 utilisateurs",
                    "Badge partenaire Mariable"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span className="text-wedding-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Option 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-wedding-olive to-wedding-olive/90 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <Sparkles className="w-8 h-8 text-premium-cream/50" />
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif">Option 2 - Premium</h3>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <p className="text-4xl font-bold mb-2">450€</p>
                  <p className="text-white/90">Pack 10 clients</p>
                  <p className="text-sm text-white/70 mt-2">45€ par couple au lieu de 60€</p>
                </div>

                <ul className="space-y-4 mb-6">
                  {[
                    "6 mois Premium offerts par couple",
                    "Accès complet à tous les outils",
                    "Support prioritaire pour vos clients",
                    "Tous les avantages de l'Option 1",
                    "Meilleure coordination jour J"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-premium-cream mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Pourquoi recommander */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-wedding-black mb-4">
                Pourquoi recommander Mariable ?
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Service premium à moindre coût",
                  description: "Offrez à vos clients un outil professionnel accessible qui valorise votre prestation"
                },
                {
                  icon: Zap,
                  title: "Meilleure coordination",
                  description: "Fini les fichiers Excel et mails à rallonge. Communication fluide entre vous et les mariés"
                },
                {
                  icon: Users,
                  title: "+500 utilisateurs conquis",
                  description: "Rejoignez notre réseau de partenaires premium et gagnez en visibilité auprès de futurs mariés"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-premium-sage/20 flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-wedding-olive" />
                  </div>
                  <h3 className="text-xl font-serif text-wedding-black mb-3">{item.title}</h3>
                  <p className="text-wedding-black/70 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Process */}
        <section className="py-16 px-4 bg-gradient-to-b from-premium-cream to-white">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-wedding-black mb-4">
                Comment obtenir le pack 10 clients ?
              </h2>
            </motion.div>

            <div className="space-y-6">
              {[
                { number: "1", text: "Vous validez l'accord de partenariat" },
                { number: "2", text: "Je vous envoie le contrat et la facture pour le pack" },
                { number: "3", text: "Vos mariés réservent leur prestation chez vous et créent leur compte sur mariable.fr" },
                { number: "4", text: "Vous m'envoyez leurs adresses mail pour que j'active leurs accès Premium 6 mois" }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-6 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-full bg-wedding-olive text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {step.number}
                  </div>
                  <p className="text-lg text-wedding-black/80 pt-2">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final avec Formulaire */}
        <section className="py-20 px-4 bg-gradient-to-br from-wedding-olive to-wedding-olive/90">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
                Prêt à devenir partenaire ?
              </h2>
              <p className="text-xl text-white/90">
                Laissez-nous vos coordonnées et nous vous recontacterons rapidement
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl p-8 space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-wedding-black font-medium">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-300 focus:border-wedding-olive"
                  placeholder="Votre nom et prénom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-wedding-black font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 border-gray-300 focus:border-wedding-olive"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-wedding-black font-medium">
                  Nom de votre entreprise
                </Label>
                <Input
                  id="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="border-gray-300 focus:border-wedding-olive"
                  placeholder="Nom de votre société"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-wedding-black font-medium">
                  Téléphone
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 border-gray-300 focus:border-wedding-olive"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-wedding-black font-medium">
                  Message
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="pl-10 border-gray-300 focus:border-wedding-olive min-h-[120px]"
                    placeholder="Parlez-nous de votre entreprise et de vos besoins..."
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    Devenir partenaire
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-gray-500">
                En soumettant ce formulaire, vous acceptez d'être contacté par Mariable.
              </p>
            </motion.form>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Partenariat;
