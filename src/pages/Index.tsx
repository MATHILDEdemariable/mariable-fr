
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import Header from '@/components/Header';
import { ArrowRight, Sparkles, Calendar, MapPin, Heart, Instagram, Mail, Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const [formVisible, setFormVisible] = useState(false);
  
  const form = useForm({
    defaultValues: {
      weddingDescription: ''
    }
  });

  const onSubmit = (data: { weddingDescription: string }) => {
    // Store the wedding description in localStorage to use it in the ChatInterface
    localStorage.setItem('weddingDescription', data.weddingDescription);
    navigate('/commencer');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Wedding Image Background */}
        <section className="relative min-h-screen flex items-center">
          {/* Image Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <img
              src="/lovable-uploads/9f8c319a-9a98-4d4c-a886-79f9986a7dcd.png"
              alt="Couple de mariés marchant sous une pluie de pétales"
              className="absolute min-w-full min-h-full object-cover"
              style={{ objectPosition: "center 25%" }}
            />
            <div className="absolute inset-0 bg-wedding-black/40 backdrop-blur-[2px]"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-wedding-light text-sm text-wedding-black mb-4">
                <Sparkles size={14} className="mr-2" />
                <span>Nouveau en 2025</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-white mb-6">
                Organisez le mariage <span className="text-wedding-cream">dont vous rêvez</span>
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Dites-nous ce dont vous avez besoin ou quel est le mariage parfait pour vous ! 💍
              </p>
            </div>

            {/* Search Form inspired by Le Collectionist */}
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
                <div className="p-6 md:p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="weddingDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Décrivez votre mariage idéal ou ce dont vous avez besoin pour l'organiser..."
                                className="resize-none min-h-[120px] text-lg focus:ring-wedding-olive p-4"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-center">
                        <Button 
                          type="submit"
                          size="lg" 
                          className="gap-2 bg-wedding-olive hover:bg-wedding-olive/90 text-white rounded-full px-8 py-6 text-lg transform transition-transform hover:scale-105"
                        >
                          Parler à votre assistant mariage <ArrowRight size={18} />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </Card>
              
              <div className="mt-6 flex justify-center gap-2 items-center">
                <button 
                  onClick={() => navigate('/demo')}
                  className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
                >
                  <span>Vous ne savez pas par où commencer ?</span>
                  <span className="underline font-medium">Voir une démo</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif mb-4">Comment Mariable transforme votre expérience</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dites adieu au stress et aux heures interminables de recherche de prestataires
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Gain de temps</h3>
                <p className="text-muted-foreground">
                  Trouvez tous vos prestataires en quelques minutes au lieu de plusieurs semaines de recherche.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Recommandations personnalisées</h3>
                <p className="text-muted-foreground">
                  Des suggestions qui correspondent parfaitement à votre style, votre région et votre budget.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-wedding-black/10 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-wedding-black/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-wedding-black" />
                </div>
                <h3 className="text-xl font-serif mb-2">Sans stress</h3>
                <p className="text-muted-foreground">
                  Une approche intuitive et conversationnelle pour organiser chaque aspect de votre mariage.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Chatbot Section - Deuxième partie de la landing page */}
        <section className="py-20 bg-wedding-cream/30">
          <div className="container mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Prêt à révolutionner l'organisation de votre mariage ?</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
              <ChatInterface />
            </div>
          </div>
        </section>
        
        {/* Call to Action - Simplified */}
        <section id="contact" className="py-16 md:py-24 bg-white text-wedding-black">
          <div className="container text-center">
            <Button 
              size="lg" 
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              asChild
            >
              <Link to="/commencer">
                Essayer Mariable maintenant
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-12 bg-white text-wedding-black">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-12 w-auto" />
              </div>
              <p className="mb-4 text-wedding-black/70">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-wedding-black/70 hover:text-wedding-black">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-wedding-black/70 hover:text-wedding-black">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-wedding-black/70 hover:text-wedding-black">Planification</Link></li>
                <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-wedding-black/70 hover:text-wedding-black">Conseils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">À Propos</h3>
              <ul className="space-y-2">
                <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-wedding-black/70 hover:text-wedding-black">Témoignages</Link></li>
                <li><Link to="/contact/nous-contacter" className="text-wedding-black/70 hover:text-wedding-black">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-wedding-black shrink-0 mt-0.5" />
                  <span className="text-wedding-black/70">123 Rue du Mariage, 75001 Paris, France</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-wedding-black shrink-0" />
                  <span className="text-wedding-black/70">+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-wedding-black shrink-0" />
                  <span className="text-wedding-black/70">contact@mariable.fr</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-wedding-black/70 mb-4 md:mb-0">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="text-sm text-wedding-black/70 hover:text-wedding-black">Mentions Légales</Link>
              <Link to="/cgv" className="text-sm text-wedding-black/70 hover:text-wedding-black">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
