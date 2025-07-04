
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Linkedin } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, Form, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveInscription, sendConfirmationEmail, sendToMakeWebhook, InscriptionData } from '@/services/inscriptionService';
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().optional(),
  comment: z.string().optional(),
  userType: z.enum(["couple", "professional"], {
    required_error: "Veuillez sélectionner une option",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EmailCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      comment: "",
      userType: "couple",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const inscriptionData: InscriptionData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        comment: data.comment,
        userType: data.userType
      };
      
      await sendToMakeWebhook(inscriptionData);
      
      const inscriptionSaved = await saveInscription(inscriptionData);
      const emailSent = await sendConfirmationEmail(inscriptionData);
      
      if (inscriptionSaved && emailSent) {
        toast({
          title: "Inscription réussie",
          description: "Merci pour votre inscription ! Nous vous contacterons bientôt.",
        });
        navigate('/demo');
      } else if (inscriptionSaved) {
        toast({
          title: "Inscription partielle",
          description: "Votre inscription a été enregistrée mais nous avons rencontré un problème lors de l'envoi de la notification.",
          variant: "destructive",
        });
        navigate('/demo');
      } else {
        console.log("Mode démo: inscription simulée pour", data.email);
        toast({
          title: "Inscription enregistrée",
          description: "Merci pour votre inscription ! Nous sommes actuellement en mode démo, mais nous avons bien noté votre intérêt.",
        });
        navigate('/demo');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de votre inscription. Veuillez réessayer ultérieurement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow flex items-start justify-center py-16">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" 
              alt="Mariable Logo" 
              className="h-20 mx-auto mb-4" 
            />
            <h2 className="text-3xl font-serif">Commencez votre aventure</h2>
            <p className="text-muted-foreground mt-2">
              Créez votre compte pour accéder à toutes les fonctionnalités de Mariable et recevoir des conseils exclusifs pour votre mariage.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Votre adresse email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="Votre numéro de téléphone" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Vous êtes</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="couple" id="couple" />
                          <Label htmlFor="couple">Futurs mariés</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="professional" id="professional" />
                          <Label htmlFor="professional">Professionnel du mariage</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Partagez vos attentes ou vos besoins particuliers..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-wedding-black hover:bg-wedding-black/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Inscription en cours..." : "Créer mon compte"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                En vous inscrivant, vous acceptez notre politique de confidentialité et nos conditions d'utilisation.
              </p>
            </form>
          </Form>
        </div>
      </main>
      
      <footer className="py-8 md:py-12 bg-white text-wedding-black">
        <div className="container px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-10 md:h-12 w-auto" />
              </div>
              <p className="mb-4 text-wedding-black/70 text-sm">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/mariable.fr/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-wedding-black hover:text-wedding-black/70 transition-colors">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Liens Rapides</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Planification</Link></li>
                <li><Link to="/services/budget" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Conseils</Link></li>
              </ul>
            </div>
            
            <div className="mt-6 sm:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">À Propos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about/histoire" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Témoignages</Link></li>
                <li><Link to="/contact" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <h3 className="font-serif text-base md:text-lg mb-3 md:mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5 text-wedding-black shrink-0" />
                  <a href="mailto:mathilde@mariable.fr" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    mathilde@mariable.fr
                  </a>
                </li>
                <li className="flex items-center">
                  <Linkedin className="mr-2 h-4 w-4 md:h-5 md:w-5 text-wedding-black shrink-0" />
                  <a href="https://www.linkedin.com/in/lambertmathilde/" target="_blank" rel="noopener noreferrer" className="text-wedding-black/70 hover:text-wedding-black transition-colors">
                    LinkedIn Professionnel
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 pt-6 border-t border-wedding-black/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs md:text-sm text-wedding-black/70 mb-4 md:mb-0 text-center md:text-left">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-4 md:gap-6 text-xs md:text-sm">
              <Link to="/mentions-legales" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Mentions Légales</Link>
              <Link to="/politique-confidentialite" className="text-wedding-black/70 hover:text-wedding-black transition-colors">Politique de Confidentialité</Link>
              <Link to="/cgv" className="text-wedding-black/70 hover:text-wedding-black transition-colors">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmailCapture;
