import { JeuneMarie } from '@/types/jeunes-maries';

export const fakeTestimonials: Omit<JeuneMarie, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    nom_complet: "Sarah & Antoine Dubois",
    email: "sarah.dubois@example.com",
    telephone: "06 12 34 56 78",
    lieu_mariage: "Château de Versailles, Versailles",
    date_mariage: "2023-06-15",
    nombre_invites: 120,
    budget_approximatif: "30000-40000",
    photo_principale_url: "/lovable-uploads/fake-testimonial-1.jpg",
    photos_mariage: [
      { url: "/lovable-uploads/fake-testimonial-1.jpg", description: "Photo principale" }
    ],
    experience_partagee: "Notre mariage a été un rêve qui s'est réalisé ! Grâce à Mariable, nous avons pu organiser chaque détail avec sérénité. L'application nous a permis de suivre notre budget en temps réel et de coordonner tous nos prestataires efficacement. Le jour J s'est déroulé sans aucun stress !",
    conseils_couples: "Commencez votre organisation au moins 12 mois à l'avance et n'hésitez pas à déléguer. Mariable a été notre meilleur allié pour garder une vue d'ensemble et ne rien oublier. Le plus important : profitez de chaque moment !",
    prestataires_recommandes: [
      {
        nom: "Fleurs de Jardins",
        service: "Fleuriste",
        note: 5,
        commentaire: "Créations magnifiques et service impeccable"
      },
      {
        nom: "Photo Lumière",
        service: "Photographe",
        note: 5,
        commentaire: "Photos sublimes qui capturent parfaitement l'émotion"
      }
    ],
    note_experience: 5,
    slug: "sarah-antoine-dubois",
    visible: true,
    status_moderation: "approuve",
    date_soumission: "2023-07-01T10:00:00Z",
    date_approbation: "2023-07-02T14:30:00Z",
    admin_notes: "Témoignage fictif pour démonstration",
    accept_email_contact: true
  },
  {
    nom_complet: "Emma & Lucas Martin",
    email: "emma.martin@example.com",
    telephone: "06 23 45 67 89",
    lieu_mariage: "Domaine de la Bergerie, Provence",
    date_mariage: "2023-09-02",
    nombre_invites: 80,
    budget_approximatif: "20000-30000",
    photo_principale_url: "/lovable-uploads/fake-testimonial-2.jpg",
    photos_mariage: [
      { url: "/lovable-uploads/fake-testimonial-2.jpg", description: "Couple heureux" }
    ],
    experience_partagee: "Nous voulions un mariage intimiste en Provence et Mariable nous a accompagnés dans cette aventure. L'organisation était fluide, les outils de budget très pratiques et le planning du jour J parfaitement orchestré. Une expérience inoubliable !",
    conseils_couples: "Définissez vos priorités dès le début et tenez-vous-y ! Mariable aide vraiment à rester dans le budget et à coordonner tous les aspects. Notre conseil : prenez le temps de savourer les préparatifs, c'est aussi magique que le jour J.",
    prestataires_recommandes: [
      {
        nom: "Saveurs de Provence",
        service: "Traiteur",
        note: 5,
        commentaire: "Cuisine raffinée avec des produits locaux exceptionnels"
      }
    ],
    note_experience: 5,
    slug: "emma-lucas-martin",
    visible: true,
    status_moderation: "approuve",
    date_soumission: "2023-10-15T09:15:00Z",
    date_approbation: "2023-10-16T11:20:00Z",
    admin_notes: "Témoignage fictif pour démonstration",
    accept_email_contact: true
  },
  {
    nom_complet: "Camille & Thomas Rousseau",
    email: "camille.rousseau@example.com",
    telephone: "06 34 56 78 90",
    lieu_mariage: "Manoir de la Roseraie, Loire",
    date_mariage: "2023-05-20",
    nombre_invites: 150,
    budget_approximatif: "40000-50000",
    photo_principale_url: "/lovable-uploads/fake-testimonial-3.jpg",
    photos_mariage: [
      { url: "/lovable-uploads/fake-testimonial-3.jpg", description: "Mariée radieuse" }
    ],
    experience_partagee: "Mariable a transformé ce qui aurait pu être stressant en une organisation plaisante ! Les fonctionnalités de suivi des prestataires et la gestion documentaire ont été particulièrement utiles. Nous recommandons vivement !",
    conseils_couples: "Utilisez tous les outils de Mariable dès le début, même pour les petits détails. Cela permet de garder une trace de tout et d'éviter les oublis. N'oubliez pas de prévoir du temps pour vous en tant que couple pendant les préparatifs.",
    prestataires_recommandes: [
      {
        nom: "Musique & Emotions",
        service: "DJ",
        note: 4,
        commentaire: "Ambiance parfaite, lecture impeccable des invités"
      },
      {
        nom: "Gâteaux de Rêve",
        service: "Pâtissier",
        note: 5,
        commentaire: "Wedding cake somptueux et délicieux"
      }
    ],
    note_experience: 4,
    slug: "camille-thomas-rousseau",
    visible: true,
    status_moderation: "approuve",
    date_soumission: "2023-06-10T16:45:00Z",
    date_approbation: "2023-06-11T09:30:00Z",
    admin_notes: "Témoignage fictif pour démonstration",
    accept_email_contact: false
  },
  {
    nom_complet: "Léa & Maxime Petit",
    email: "lea.petit@example.com",
    telephone: "06 45 67 89 01",
    lieu_mariage: "Plage des Sables d'Or, Bretagne",
    date_mariage: "2023-08-12",
    nombre_invites: 60,
    budget_approximatif: "15000-20000",
    photo_principale_url: "/lovable-uploads/fake-testimonial-4.jpg",
    photos_mariage: [
      { url: "/lovable-uploads/fake-testimonial-4.jpg", description: "Couple en bord de mer" }
    ],
    experience_partagee: "Mariage les pieds dans le sable, un rêve devenu réalité ! Mariable nous a permis de gérer les contraintes spécifiques d'un mariage sur la plage. Les checklists personnalisées ont été un vrai plus pour ne rien oublier.",
    conseils_couples: "Pour un mariage en extérieur, prévoyez toujours un plan B ! Mariable aide à anticiper tous les scénarios. Notre astuce : impliquez vos proches dans l'organisation, c'est encore plus convivial.",
    prestataires_recommandes: [
      {
        nom: "Océan Réceptions",
        service: "Organisateur",
        note: 5,
        commentaire: "Spécialistes des mariages en bord de mer, très professionnels"
      }
    ],
    note_experience: 5,
    slug: "lea-maxime-petit",
    visible: true,
    status_moderation: "approuve",
    date_soumission: "2023-09-05T14:20:00Z",
    date_approbation: "2023-09-06T10:15:00Z",
    admin_notes: "Témoignage fictif pour démonstration",
    accept_email_contact: true
  },
  {
    nom_complet: "Julie & Alexandre Moreau",
    email: "julie.moreau@example.com",
    telephone: "06 56 78 90 12",
    lieu_mariage: "Château de Malmaison, Île-de-France",
    date_mariage: "2023-10-07",
    nombre_invites: 100,
    budget_approximatif: "25000-35000",
    photo_principale_url: "/lovable-uploads/fake-testimonial-5.jpg",
    photos_mariage: [
      { url: "/lovable-uploads/fake-testimonial-5.jpg", description: "Mariée élégante" }
    ],
    experience_partagee: "Organisation parfaite grâce à Mariable ! L'interface intuitive et les rappels automatiques nous ont évité bien des stress. Le jour J s'est déroulé comme sur des roulettes. Merci Mariable !",
    conseils_couples: "Faites confiance aux outils de Mariable pour la planification. Les fonctionnalités de coordination le jour J sont particulièrement précieuses. Notre conseil : déléguez et profitez de votre journée !",
    prestataires_recommandes: [
      {
        nom: "Décors de Charme",
        service: "Décorateur",
        note: 4,
        commentaire: "Décoration raffinée qui correspond parfaitement à nos attentes"
      }
    ],
    note_experience: 4,
    slug: "julie-alexandre-moreau",
    visible: true,
    status_moderation: "approuve",
    date_soumission: "2023-11-15T13:30:00Z",
    date_approbation: "2023-11-16T08:45:00Z",
    admin_notes: "Témoignage fictif pour démonstration",
    accept_email_contact: true
  },
  {
    nom_complet: "Manon & Pierre Lefebvre",
    email: "manon.lefebvre@example.com",
    telephone: "06 67 89 01 23",
    lieu_mariage: "Ferme de la Vallée, Normandie",
    date_mariage: "2023-07-29",
    nombre_invites: 90,
    budget_approximatif: "22000-28000",
    photo_principale_url: "/lovable-uploads/fake-testimonial-6.jpg",
    photos_mariage: [
      { url: "/lovable-uploads/fake-testimonial-6.jpg", description: "Couple moderne" }
    ],
    experience_partagee: "Mariable a été notre guide tout au long des préparatifs. L'application nous a permis de rester organisés et sereins. Le support client est également très réactif. Une expérience utilisateur au top !",
    conseils_couples: "Explorez toutes les fonctionnalités de Mariable dès le début, elles sont toutes utiles ! Notre astuce : utilisez la fonction de partage avec vos témoins, c'est très pratique pour coordonner l'aide.",
    prestataires_recommandes: [
      {
        nom: "Bio Terroir",
        service: "Traiteur",
        note: 5,
        commentaire: "Cuisine bio et locale, parfait pour notre mariage champêtre"
      },
      {
        nom: "Sons d'Antan",
        service: "Musiciens",
        note: 4,
        commentaire: "Groupe acoustique qui a créé une ambiance parfaite"
      }
    ],
    note_experience: 5,
    slug: "manon-pierre-lefebvre",
    visible: true,
    status_moderation: "approuve",
    date_soumission: "2023-08-20T15:10:00Z",
    date_approbation: "2023-08-21T12:25:00Z",
    admin_notes: "Témoignage fictif pour démonstration",
    accept_email_contact: false
  }
];