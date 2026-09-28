# Page d'inscription — Démo live Mariable Pro (jeudi 1er octobre, 14h30)

## Ce que verront les visiteurs
Nouvelle page autonome **/demo-pro**, avec le même en-tête que le reste du site et le style Mariable (beige #F8F5EF, vert sauge, noir, Playfair), dans une version plus « événement » :

1. **Hero** : sur-titre « LIVE · DÉMO PRO », titre « Découvrez l'appli Jour J en direct », date mise en avant en grand : **Jeudi 1er octobre · 14h30 · 40 min · en ligne**, avec un compte à rebours discret.
2. **Programme en 2 temps** : 20 min de démo de l'appli Mariable Pro + 20 min de questions-réponses entre pros.
3. **Formulaire** : Nom, Email, Métier (texte libre) + case de consentement. Bouton « JE M'INSCRIS ».
4. **Confirmation à l'écran** : « Vous êtes bien inscrit ! Vous recevrez le lien le jour J. »
5. **Email automatique** envoyé à l'inscrit avec le même message (date, heure, durée, programme), et une copie à mathilde@mariable.fr.

Page disponible en FR et EN (bouton de langue), adaptée au mobile.

## Hypothèses
- Il s'agit d'une démo de **Mariable** (pas Lovable) ; le lien de visio sera envoyé manuellement par vous le jour J.
- L'email part de « Mariable <mathilde@mariable.fr> », comme les notifications actuelles.

## Détails techniques
- Table `demo_registrations` (full_name, email, job_title, rgpd_consent, created_at) : GRANT INSERT à anon/authenticated, RLS insertion publique, lecture réservée aux admins (`has_role`).
- Fonction serveur `send-demo-registration-email` utilisant le secret Resend existant (`RESEND`), validation zod, échappement HTML, CORS.
- Page `src/pages/DemoPro.tsx` (lazy), route dans `App.tsx`, SEO Helmet + JSON-LD `Event`, traductions dans `fr/en/demoPro.json`.
- Validation côté client (zod) ; si l'email échoue, l'inscription reste enregistrée.
