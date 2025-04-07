
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  userType: z.enum(["couple", "professional"], {
    required_error: "Veuillez sélectionner une option",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EmailCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "couple",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call to register user and send notification email
    setTimeout(() => {
      // Log the email notification that would be sent to mathilde@mariable.fr
      console.log(`Email notification sent to mathilde@mariable.fr:
      Nouvel utilisateur inscrit:
      Prénom: ${data.firstName}
      Nom: ${data.lastName}
      Email: ${data.email}
      Type: ${data.userType === "couple" ? "Futurs mariés" : "Professionnel"}`);
      
      toast({
        title: "Inscription réussie",
        description: "Merci pour votre inscription ! Nous vous contacterons bientôt.",
      });
      
      setIsSubmitting(false);
      navigate('/demo'); // Redirect to demo page
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-wedding-cream">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16">
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
      
      <footer className="py-12 bg-wedding-black text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/3768f435-13c3-49a1-bbb3-87acf3b26cda.png" alt="Mariable Logo" className="h-12 w-auto" />
              </div>
              <p className="mb-4 text-white/70">
                Mariable est votre partenaire privilégié pour créer le mariage de vos rêves, en simplifiant chaque étape de l'organisation.
              </p>
              <div className="flex gap-4">
                <a href="https://facebook.com" aria-label="Facebook" className="text-white hover:text-wedding-cream">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="text-white hover:text-wedding-cream">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" aria-label="Twitter" className="text-white hover:text-wedding-cream">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Liens Rapides</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-white/70 hover:text-white">Accueil</Link></li>
                <li><Link to="/services/prestataires" className="text-white/70 hover:text-white">Prestataires</Link></li>
                <li><Link to="/services/planification" className="text-white/70 hover:text-white">Planification</Link></li>
                <li><Link to="/services/budget" className="text-white/70 hover:text-white">Budget</Link></li>
                <li><Link to="/services/conseils" className="text-white/70 hover:text-white">Conseils</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">À Propos</h3>
              <ul className="space-y-2">
                <li><Link to="/about/histoire" className="text-white/70 hover:text-white">Notre Histoire</Link></li>
                <li><Link to="/about/approche" className="text-white/70 hover:text-white">Notre Approche</Link></li>
                <li><Link to="/about/temoignages" className="text-white/70 hover:text-white">Témoignages</Link></li>
                <li><Link to="/contact/nous-contacter" className="text-white/70 hover:text-white">Nous Contacter</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif text-lg mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-wedding-cream shrink-0 mt-0.5" />
                  <span className="text-white/70">123 Rue du Mariage, 75001 Paris, France</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-wedding-cream shrink-0" />
                  <span className="text-white/70">+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-wedding-cream shrink-0" />
                  <span className="text-white/70">contact@mariable.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/70 mb-4 md:mb-0">
              © 2025 Mariable - Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="text-sm text-white/70 hover:text-white">Mentions Légales</Link>
              <Link to="/politique-confidentialite" className="text-sm text-white/70 hover:text-white">Politique de Confidentialité</Link>
              <Link to="/cgv" className="text-sm text-white/70 hover:text-white">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmailCapture;
