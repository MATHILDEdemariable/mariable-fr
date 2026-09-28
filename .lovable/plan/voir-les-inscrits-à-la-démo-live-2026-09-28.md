# Voir les inscrits à la démo live

## Ce qui existe déjà
- Chaque inscription est enregistrée dans la liste des inscrits à la démo (nom, email, métier, consentement, date).
- Chaque inscription envoie une copie cachée de l'email de confirmation à mathilde@mariable.fr : votre boîte mail garde donc déjà un historique.

## Ce qui manque
Il n'y a pas encore d'écran dans l'admin pour voir la liste.

## Ce que je propose
1. Nouvelle page admin **« Inscrits démo live »** (/admin/demo-registrations), réservée aux comptes admin.
2. Tableau : date d'inscription, nom, email, métier. Les plus récents en premier, avec le total affiché.
3. Bouton **« Exporter CSV »** pour récupérer les emails le jour J et envoyer le lien de la visio.
4. Nouvelle carte « Inscrits démo live » sur le tableau de bord admin pour accéder à la page.

## Détails techniques
- Lecture de `demo_registrations` via le client Supabase, protégée par `useAdminAuth` (`is_admin()`). La règle d'accès en lecture de la table sera vérifiée et alignée sur `is_admin()` si besoin.
- Réutilisation de `AdminLayout` et de l'utilitaire `src/lib/csvExport.ts`.
- Route chargée à la demande dans `App.tsx`.
