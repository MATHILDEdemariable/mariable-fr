
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Vendor } from '@/types';
import { useNavigate } from 'react-router-dom';

interface VendorInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
}

const formSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
});

type FormValues = z.infer<typeof formSchema>;

const VendorInfoModal: React.FC<VendorInfoModalProps> = ({ isOpen, onClose, vendor }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call to save email and send notification to admin
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      
      // Simulate sending email to admin
      console.log(`Email notification sent to mathilde@mariable.fr about new user: ${data.email}`);
      
      toast({
        title: "Compte créé avec succès",
        description: "Vous allez être redirigé vers notre page de démonstration.",
      });
      
      // Reset the form
      form.reset();
      
      // Redirect to demo page after short delay
      setTimeout(() => {
        navigate('/demo');
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif">
            {hasSubmitted ? `Informations sur ${vendor.nom}` : 'Créer votre compte'}
          </DialogTitle>
          <DialogDescription>
            {hasSubmitted ? (
              <div className="mt-2 space-y-4">
                <p className="font-medium">Merci pour votre inscription !</p>
                <p className="text-sm">
                  Nous avons bien reçu votre demande concernant {vendor.nom}.
                  Nous vous recontacterons très prochainement avec les coordonnées complètes
                  et toutes les informations sur ce prestataire.
                </p>
                <p className="text-sm">
                  Vous êtes maintenant redirigé vers notre page de démonstration.
                </p>
              </div>
            ) : (
              <p className="mt-2">
                Pour découvrir les coordonnées de ce prestataire et accéder à notre démonstration, veuillez créer votre compte en entrant votre email 👇
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {!hasSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Votre email"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              >
                {isSubmitting ? "Création en cours..." : "Créer mon compte"}
              </Button>
            </form>
          </Form>
        ) : (
          <Button 
            onClick={onClose} 
            className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white mt-4"
          >
            Fermer
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorInfoModal;
