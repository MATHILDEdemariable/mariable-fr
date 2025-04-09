
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Initialisation du client Supabase avec les données d'environnement
// Vérification de l'existence des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Création d'une fonction qui vérifie si Supabase est configuré
const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Initialisation conditionnelle du client Supabase
const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface InscriptionData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  phone?: string;
  comment?: string;
}

export async function saveInscription(data: InscriptionData) {
  try {
    // Vérification de la configuration Supabase
    if (!supabase) {
      console.error('Erreur: Supabase n\'est pas configuré. Variables d\'environnement manquantes.');
      toast({
        title: "Erreur de configuration",
        description: "La connexion à la base de données n'est pas configurée. Veuillez contacter l'administrateur.",
        variant: "destructive"
      });
      return false;
    }
    
    // Enregistrement de l'inscription dans la base de données
    const { error } = await supabase
      .from('inscriptions')
      .insert([
        {
          prenom: data.firstName,
          nom: data.lastName,
          email: data.email,
          telephone: data.phone || null,
          commentaire: data.comment || null,
          date_inscription: new Date().toISOString(),
          type_utilisateur: data.userType === 'couple' ? 'Futurs mariés' : 'Professionnel'
        }
      ]);
      
    if (error) {
      console.error('Erreur lors de l\'enregistrement de l\'inscription:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de l'enregistrement de votre inscription.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
}

export async function sendToMakeWebhook(data: InscriptionData) {
  try {
    const webhookUrl = 'https://hook.eu2.make.com/c7jvw1pvlv8hxn3lv4bv8ue0hse5w324';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        comment: data.comment || '',
        userType: data.userType === 'couple' ? 'Futurs mariés' : 'Professionnel'
      }),
      mode: 'no-cors', // Pour éviter les problèmes CORS avec le webhook
    });

    // Puisque nous utilisons 'no-cors', nous ne pourrons pas vérifier le statut de la réponse
    // Nous supposons que l'envoi a réussi
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données au webhook Make:', error);
    return false;
  }
}

export async function sendConfirmationEmail(data: InscriptionData) {
  try {
    // Vérification de la configuration Supabase
    if (!supabase) {
      console.error('Erreur: Supabase n\'est pas configuré. Variables d\'environnement manquantes.');
      return false;
    }
    
    // Envoi d'un email via l'API Supabase Edge Function
    const { error } = await supabase.functions.invoke('send-inscription-email', {
      body: {
        to: 'mathilde@mariable.fr',
        subject: 'Nouvelle inscription sur Mariable',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || 'Non renseigné',
        comment: data.comment || 'Aucun commentaire',
        userType: data.userType === 'couple' ? 'Futurs mariés' : 'Professionnel',
        date: new Date().toLocaleDateString('fr-FR')
      }
    });

    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}
