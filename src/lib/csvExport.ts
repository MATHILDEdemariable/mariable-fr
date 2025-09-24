/**
 * Utilitaire pour l'export CSV des utilisateurs admin
 */

export interface UserExportData {
  email: string;
  nom_complet: string;
  date_inscription: string;
  telephone: string;
  date_mariage: string;
  statut_abonnement: string;
  nombre_invites: string;
}

export const exportUsersToCSV = (users: any[]): void => {
  console.log('🚀 exportUsersToCSV started:', { userCount: users.length });
  
  try {
    // Préparer les données pour CSV
    const csvData: UserExportData[] = users.map(user => {
      const profile = user.profile || {};
      
      return {
        email: user.email || 'Non renseigné',
        nom_complet: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}`.trim()
          : user.raw_user_meta_data?.first_name && user.raw_user_meta_data?.last_name
            ? `${user.raw_user_meta_data.first_name} ${user.raw_user_meta_data.last_name}`.trim()
            : 'Non renseigné',
        date_inscription: user.created_at 
          ? new Date(user.created_at).toLocaleDateString('fr-FR')
          : 'Non renseigné',
        telephone: profile.phone || user.raw_user_meta_data?.phone || 'Non renseigné',
        date_mariage: profile.wedding_date 
          ? new Date(profile.wedding_date).toLocaleDateString('fr-FR')
          : 'Non renseigné',
        statut_abonnement: profile.subscription_type || 'Gratuit',
        nombre_invites: profile.guest_count?.toString() || 'Non renseigné'
      };
    });

    // Créer l'en-tête CSV
    const headers = [
      'Email',
      'Nom Complet',
      'Date Inscription',
      'Téléphone',
      'Date Mariage',
      'Statut Abonnement',
      'Nombre Invités'
    ];

    // Convertir en CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_mariable_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ CSV export completed successfully');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'export CSV:', error);
    throw new Error(`Impossible d'exporter les données: ${error.message}`);
  }
};

export interface PrestataireExportData {
  nom: string;
  categorie: string;
  ville: string;
  region: string;
  telephone: string;
  email: string;
  site_web: string;
  prix_min: string;
  prix_max: string;
  description: string;
  visible: string;
  featured: string;
  date_creation: string;
}

export const exportPrestatairesToCSV = (prestataires: any[]): void => {
  console.log('🚀 exportPrestatairesToCSV started:', { prestataireCount: prestataires.length });
  
  try {
    // Préparer les données pour CSV
    const csvData: PrestataireExportData[] = prestataires.map(presta => ({
      nom: presta.nom || 'Non renseigné',
      categorie: presta.categorie || 'Non renseigné',
      ville: presta.ville || 'Non renseigné',
      region: presta.region || 'Non renseigné',
      telephone: presta.telephone || 'Non renseigné',
      email: presta.email || 'Non renseigné',
      site_web: presta.site_web || 'Non renseigné',
      prix_min: presta.prix_min?.toString() || 'Non renseigné',
      prix_max: presta.prix_max?.toString() || 'Non renseigné',
      description: (presta.description || 'Non renseigné').replace(/\n/g, ' ').substring(0, 500),
      visible: presta.visible ? 'Oui' : 'Non',
      featured: presta.featured ? 'Oui' : 'Non',
      date_creation: presta.created_at 
        ? new Date(presta.created_at).toLocaleDateString('fr-FR')
        : 'Non renseigné'
    }));

    // Créer l'en-tête CSV
    const headers = [
      'Nom',
      'Catégorie',
      'Ville',
      'Région',
      'Téléphone',
      'Email',
      'Site Web',
      'Prix Min',
      'Prix Max',
      'Description',
      'Visible',
      'Mis en avant',
      'Date Création'
    ];

    // Convertir en CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        Object.values(row).map(value => 
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `prestataires_mariable_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Prestataires CSV export completed successfully');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'export CSV prestataires:', error);
    throw new Error(`Impossible d'exporter les prestataires: ${error.message}`);
  }
};

export const generateBlogCSVTemplate = (): void => {
  console.log('🚀 generateBlogCSVTemplate started');
  
  try {
    const headers = [
      'title',
      'subtitle',
      'category',
      'content',
      'tags',
      'status',
      'featured',
      'meta_title',
      'meta_description',
      'h1_title',
      'h2_titles'
    ];

    const exampleRow = [
      'Mon Premier Article',
      'Sous-titre de mon article',
      'Conseils',
      'Contenu de l\'article en markdown...',
      'mariage,conseils,blog',
      'draft',
      'false',
      'Mon Premier Article - Mariable Blog',
      'Découvrez des conseils pour votre mariage',
      'Mon Premier Article de Blog',
      'Introduction,Développement,Conclusion'
    ];

    const csvContent = [
      headers.join(','),
      exampleRow.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_import_blog_mariable.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Template CSV generated successfully');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du template:', error);
    throw new Error(`Impossible de générer le template: ${error.message}`);
  }
};