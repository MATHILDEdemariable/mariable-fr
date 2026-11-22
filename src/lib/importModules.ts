import { normalizeKey, type ImportModuleConfig } from './excelImport';

export const BUDGET_CATEGORY_NAMES = ['Lieu de réception', 'Traiteur & Boissons', 'Tenues & Accessoires', 'Décoration & Fleurs', 'Photo & Vidéo', 'Musique & Animation', 'Transport', 'Papeterie', 'Cadeaux', 'Divers'];

/** Rattache une catégorie libre à une catégorie budget existante (sinon « Divers »). */
export const matchBudgetCategory = (value: string) => {
  const key = normalizeKey(value);
  if (!key) return 'Divers';
  const exact = BUDGET_CATEGORY_NAMES.find((c) => normalizeKey(c) === key);
  if (exact) return exact;
  const rules: [string[], string][] = [
    [['lieu', 'salle', 'chateau', 'domaine', 'venue'], 'Lieu de réception'],
    [['traiteur', 'boisson', 'vin', 'bar', 'cocktail', 'repas', 'gateau', 'catering', 'drink'], 'Traiteur & Boissons'],
    [['robe', 'costume', 'tenue', 'alliance', 'bijou', 'coiff', 'maquill', 'beaute', 'dress'], 'Tenues & Accessoires'],
    [['deco', 'fleur', 'flor'], 'Décoration & Fleurs'],
    [['photo', 'video'], 'Photo & Vidéo'],
    [['dj', 'musique', 'music', 'anim', 'groupe'], 'Musique & Animation'],
    [['transport', 'voiture', 'navette', 'bus', 'car'], 'Transport'],
    [['papet', 'faire', 'invitation', 'menu'], 'Papeterie'],
    [['cadeau', 'gift', 'drage'], 'Cadeaux'],
  ];
  return rules.find(([words]) => words.some((w) => key.includes(w)))?.[1] ?? 'Divers';
};

const VENDOR_STATUSES = ['à contacter', 'contactés', 'en attente', 'réponse reçue', 'à valider', 'annuler', 'validé'] as const;
export const matchVendorStatus = (value: string): (typeof VENDOR_STATUSES)[number] => {
  const key = normalizeKey(value);
  if (!key) return 'à contacter';
  const exact = VENDOR_STATUSES.find((s) => normalizeKey(s) === key);
  if (exact) return exact;
  if (key.includes('valid') || key.includes('signe') || key.includes('reserve')) return 'validé';
  if (key.includes('devis') || key.includes('repon')) return 'réponse reçue';
  if (key.includes('attente')) return 'en attente';
  if (key.includes('contacte')) return 'contactés';
  if (key.includes('annul')) return 'annuler';
  return 'à contacter';
};

export const addressBookImport: ImportModuleConfig = {
  id: 'address-book', title: "Carnet d'adresses", templateFileName: 'modele-mariable-carnet-adresses.xlsx',
  columns: [
    { key: 'company_name', label: 'Société', aliases: ['entreprise', 'company', 'nom', 'prestataire'], example: 'Fleurs de Lune', required: true },
    { key: 'category', label: 'Catégorie', aliases: ['category', 'metier', 'type'], example: 'Fleuriste' },
    { key: 'contact_name', label: 'Contact', aliases: ['nomcontact', 'interlocuteur'], example: 'Claire Martin' },
    { key: 'email', label: 'Email', aliases: ['mail', 'courriel'], example: 'claire@fleursdelune.fr' },
    { key: 'phone', label: 'Téléphone', aliases: ['tel', 'phone', 'portable', 'mobile'], example: '06 12 34 56 78' },
    { key: 'city', label: 'Ville', aliases: ['city', 'localisation'], example: 'Tours' },
    { key: 'website', label: 'Site web', aliases: ['site', 'website', 'url'], example: 'https://fleursdelune.fr' },
    { key: 'instagram', label: 'Instagram', aliases: ['insta', 'ig'], example: '@fleursdelune' },
    { key: 'notes', label: 'Notes', aliases: ['note', 'commentaire', 'commentaires'], example: 'Très réactive' },
  ],
  duplicateKey: (r) => normalizeKey(r.email) || normalizeKey(r.company_name),
};

export const guestImport: ImportModuleConfig = {
  id: 'guests', title: 'Invités', templateFileName: 'modele-mariable-invites.xlsx',
  columns: [
    { key: 'first_name', label: 'Prénom', aliases: ['prenom', 'firstname', 'first_name'], example: 'Julie', required: true },
    { key: 'last_name', label: 'Nom', aliases: ['lastname', 'last_name', 'nomdefamille'], example: 'Durand' },
    { key: 'type', label: 'Type (Adulte/Enfant)', aliases: ['type', 'adulteenfant', 'age'], example: 'Adulte' },
    { key: 'email', label: 'Email', aliases: ['mail'], example: 'julie.durand@mail.fr' },
    { key: 'phone', label: 'Téléphone', aliases: ['tel', 'phone', 'portable'], example: '06 98 76 54 32' },
    { key: 'address', label: 'Adresse', aliases: ['address', 'adressepostale'], example: '12 rue des Lilas, 75011 Paris' },
    { key: 'group', label: 'Groupe / Famille', aliases: ['groupe', 'famille', 'cote', 'group'], example: 'Famille mariée' },
    { key: 'diet', label: 'Régime alimentaire', aliases: ['regime', 'allergie', 'allergies', 'diet'], example: 'Végétarien' },
    { key: 'notes', label: 'Notes', aliases: ['note', 'commentaire'], example: '' },
  ],
  duplicateKey: (r) => normalizeKey(r.email) || normalizeKey(`${r.first_name}${r.last_name}`),
};

export const vendorTrackingImport: ImportModuleConfig = {
  id: 'vendor-tracking', title: 'Suivi des prestataires', templateFileName: 'modele-mariable-suivi-prestataires.xlsx',
  columns: [
    { key: 'vendor_name', label: 'Entreprise', aliases: ['societe', 'prestataire', 'nom', 'company'], example: 'Studio Lumière', required: true },
    { key: 'category', label: 'Catégorie', aliases: ['category', 'metier', 'type'], example: 'Photographe' },
    { key: 'status', label: 'Statut', aliases: ['status', 'etat'], example: 'Réponse reçue' },
    { key: 'email', label: 'Email', aliases: ['mail'], example: 'contact@studiolumiere.fr' },
    { key: 'phone', label: 'Téléphone', aliases: ['tel', 'phone'], example: '06 11 22 33 44' },
    { key: 'location', label: 'Ville', aliases: ['ville', 'lieu', 'localisation'], example: 'Lyon' },
    { key: 'budget', label: 'Montant estimé', aliases: ['budget', 'montant', 'prix', 'tarif'], example: '2400' },
    { key: 'website', label: 'Site web', aliases: ['site', 'url'], example: '' },
    { key: 'notes', label: 'Notes', aliases: ['note', 'commentaire'], example: 'Devis à relancer' },
  ],
  duplicateKey: (r) => normalizeKey(r.vendor_name),
};

export const budgetImport: ImportModuleConfig = {
  id: 'budget', title: 'Budget', templateFileName: 'modele-mariable-budget.xlsx',
  columns: [
    { key: 'category', label: 'Catégorie', aliases: ['category', 'poste'], example: 'Traiteur & Boissons' },
    { key: 'item_name', label: 'Dépense', aliases: ['libelle', 'item', 'designation', 'nom'], example: 'Menu traiteur', required: true },
    { key: 'estimated', label: 'Coût estimé', aliases: ['estime', 'prevu', 'budget', 'estimated'], example: '8500' },
    { key: 'actual', label: 'Coût réel', aliases: ['reel', 'actual', 'final'], example: '' },
    { key: 'deposit', label: 'Acompte versé', aliases: ['acompte', 'deposit', 'verse'], example: '2500' },
    { key: 'note', label: 'Notes', aliases: ['note', 'commentaire'], example: 'Solde J-15' },
  ],
  duplicateKey: (r) => normalizeKey(`${matchBudgetCategory(r.category)}${r.item_name}`),
};

export const retroplanningImport: ImportModuleConfig = {
  id: 'retroplanning', title: 'Rétroplanning', templateFileName: 'modele-mariable-retroplanning.xlsx',
  columns: [
    { key: 'title', label: 'Tâche', aliases: ['titre', 'task', 'action'], example: 'Réserver le photographe', required: true },
    { key: 'period', label: 'Période', aliases: ['periode', 'echeancier', 'quand'], example: 'J-9 mois' },
    { key: 'date', label: 'Échéance', aliases: ['echeance', 'date', 'deadline'], example: '2027-01-15' },
    { key: 'category', label: 'Catégorie', aliases: ['category', 'theme'], example: 'Prestataires' },
    { key: 'note', label: 'Notes', aliases: ['note', 'description', 'commentaire'], example: '' },
  ],
  duplicateKey: (r) => normalizeKey(r.title),
};
