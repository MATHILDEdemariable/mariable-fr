export interface Feature {
  id: string;
  zone: 'sidebar' | 'header' | 'card' | 'section';
  position: { top: string; left: string; width: string; height: string };
  title: string;
  description: string;
  iconUrl?: string;
  isExpandable?: boolean;
  children?: Feature[];
}

export const dashboardFeatures: Feature[] = [
  {
    id: 'mon-mariage',
    zone: 'sidebar',
    position: { top: '120px', left: '20px', width: '200px', height: '40px' },
    title: 'Mon Mariage',
    description: 'Accédez à tous vos projets de mariage sauvegardés. Créez, modifiez et gérez vos plans de mariage avec budget détaillé et rétroplanning personnalisé.',
    isExpandable: false
  },
  {
    id: 'budget',
    zone: 'sidebar',
    position: { top: '170px', left: '20px', width: '200px', height: '40px' },
    title: 'Budget',
    description: 'Gérez votre budget mariage de A à Z. Suivez vos dépenses par catégorie, comparez estimé vs réel, et gardez le contrôle de vos finances.',
    isExpandable: false
  },
  {
    id: 'checklist',
    zone: 'sidebar',
    position: { top: '220px', left: '20px', width: '200px', height: '40px' },
    title: 'Checklist Mariage',
    description: 'Ne ratez aucune étape de préparation ! Checklist complète organisée par période : 12 mois avant, 6 mois avant, 3 mois avant, jusqu\'au Jour J.',
    isExpandable: false
  },
  {
    id: 'avant-jour-j',
    zone: 'sidebar',
    position: { top: '270px', left: '20px', width: '200px', height: '40px' },
    title: 'Avant Jour J',
    description: 'Planning détaillé des derniers jours avant votre mariage. Organisez les répétitions, la répétition dîner, et toutes les tâches de dernière minute.',
    isExpandable: false
  },
  {
    id: 'mon-jour-m',
    zone: 'sidebar',
    position: { top: '320px', left: '20px', width: '200px', height: '40px' },
    title: 'Mon Jour M',
    description: 'Planning minute par minute du Jour J. Coordination complète avec équipe, prestataires, documents et timeline détaillée. L\'outil de coordination professionnelle.',
    isExpandable: true,
    children: [
      {
        id: 'jour-m-planning',
        zone: 'sidebar',
        position: { top: '360px', left: '40px', width: '180px', height: '35px' },
        title: 'Planning',
        description: 'Timeline heure par heure du Jour J avec tous les événements, activités et transitions.',
      },
      {
        id: 'jour-m-equipe',
        zone: 'sidebar',
        position: { top: '400px', left: '40px', width: '180px', height: '35px' },
        title: 'Équipe',
        description: 'Liste complète de votre équipe du Jour J : témoins, demoiselles d\'honneur, garçons d\'honneur avec leurs coordonnées.',
      },
      {
        id: 'jour-m-documents',
        zone: 'sidebar',
        position: { top: '440px', left: '40px', width: '180px', height: '35px' },
        title: 'Documents',
        description: 'Centralisez tous vos documents importants : contrats, plannings, listes, contacts prestataires.',
      },
    ]
  },
  {
    id: 'apres-jour-j',
    zone: 'sidebar',
    position: { top: '490px', left: '20px', width: '200px', height: '40px' },
    title: 'Après Jour J',
    description: 'N\'oubliez rien après le mariage ! Remerciements, récupération matériel, paiements finaux, partage photos et administratif.',
    isExpandable: false
  },
  {
    id: 'prestataires',
    zone: 'sidebar',
    position: { top: '540px', left: '20px', width: '200px', height: '40px' },
    title: 'Mes Prestataires',
    description: 'Carnet d\'adresses de tous vos prestataires. Gérez contacts, rendez-vous, devis et historique des échanges en un seul endroit.',
    isExpandable: false
  },
  {
    id: 'rsvp',
    zone: 'sidebar',
    position: { top: '590px', left: '20px', width: '200px', height: '40px' },
    title: 'RSVP Invités',
    description: 'Gérez vos confirmations de présence en ligne. Créez des formulaires RSVP personnalisés avec lien unique et QR code. Suivez en temps réel les réponses de vos invités.',
    isExpandable: false
  },
  {
    id: 'logements',
    zone: 'sidebar',
    position: { top: '640px', left: '20px', width: '200px', height: '40px' },
    title: 'Gestion de logement',
    description: 'Organisez l\'hébergement de vos invités. Gérez les réservations, assignez les chambres, suivez les disponibilités et les tarifs. Exportez facilement vos listes d\'hébergement en PDF.',
    isExpandable: false
  },
  {
    id: 'qr-code',
    zone: 'sidebar',
    position: { top: '690px', left: '20px', width: '200px', height: '40px' },
    title: 'QR Code',
    description: 'Générez des QR codes personnalisés pour votre liste de mariage, cagnotte en ligne ou site web. Facilitez l\'accès à vos liens importants pour vos invités.',
    isExpandable: false
  },
  {
    id: 'seating-plan',
    zone: 'sidebar',
    position: { top: '740px', left: '20px', width: '200px', height: '40px' },
    title: 'Plan de Table BETA',
    description: '🎯 BETA - Organisez vos invités avec drag & drop. Import depuis RSVP avec noms détaillés, import CSV, et export PDF. Créez des tables personnalisées et assignez facilement vos invités.',
    isExpandable: false
  },
  {
    id: 'user-profile',
    zone: 'header',
    position: { top: '15px', left: 'calc(100% - 200px)', width: '180px', height: '50px' },
    title: 'Profil Utilisateur',
    description: 'Gérez votre profil, vos informations personnelles, votre date de mariage et le nombre d\'invités. Accédez aux paramètres de votre compte.',
  },
  {
    id: 'share-dashboard',
    zone: 'section',
    position: { top: '100px', left: 'calc(100% - 230px)', width: '200px', height: '45px' },
    title: 'Partager le Dashboard',
    description: 'Partagez votre dashboard avec votre partenaire, famille ou wedding planner. Créez des liens de partage sécurisés avec expiration.',
  },
  {
    id: 'project-cards',
    zone: 'card',
    position: { top: '200px', left: '280px', width: '300px', height: '250px' },
    title: 'Cartes Projet',
    description: 'Chaque projet affiche un résumé complet : nombre d\'invités, budget total, lieu et date. Boutons pour voir, modifier ou supprimer.',
  },
];
