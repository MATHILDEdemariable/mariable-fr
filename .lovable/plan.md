## Itérations sur `/partenariat`

### 1. Hero — sous-titre raccourci

Dans `src/pages/Partenariat.tsx`, remplacer le sous-titre actuel (liste des métiers) par :

> « Stratégie et gestion de communication pour attirer des clients qui vous ressemblent. »

La liste des professionnels reste dans la FAQ (déjà OK).

### 2. Modal Contact — fusion téléphone / WhatsApp

Dans `src/components/partenariat/ContactProModal.tsx`, supprimer le bloc « Téléphone » et ne garder qu'un seul bloc combiné :

- Icône WhatsApp (lucide `MessageCircle`)
- Label : « Téléphone · WhatsApp »
- Numéro : `+33 7 60 10 81 89`
- Lien : `https://wa.me/33760108189` (cible `_blank`)

Résultat : 2 blocs au lieu de 3 (Email + Téléphone/WhatsApp).

### 3. Notification email à `mathilde@mariable.fr` à la soumission du formulaire

Nouvelle edge function `supabase/functions/notify-partenariat-contact/index.ts` :

- Reçoit `{ email, phone, message, subject }`
- Envoie un email via Resend (secret `RESEND` déjà configuré) :
  - From : `Mariable <mathilde@mariable.fr>`
  - To : `mathilde@mariable.fr`
  - Reply-To : email du prospect
  - Subject : `Nouvelle demande Partenariat — {subject ou "Contact"}`
  - HTML simple éditorial avec les infos du formulaire
- CORS ouvert, pas de vérification JWT (formulaire public)

Dans `ContactProModal.tsx`, après l'insert Supabase réussi, appel `supabase.functions.invoke('notify-partenariat-contact', { body: {...} })`. L'échec d'envoi du mail ne bloque pas la confirmation utilisateur (log console uniquement).

### 4. Traduction EN de la page Partenariat

Ajout d'un namespace `partenariat` dans `src/i18n` :

- `src/i18n/locales/fr/partenariat.json` — toutes les chaînes actuelles (hero, services, FAQ, contact, modal).
- `src/i18n/locales/en/partenariat.json` — traduction anglaise complète.
- Mise à jour de `src/i18n/index.ts` pour charger le namespace.

Dans `Partenariat.tsx` et `ContactProModal.tsx` : utiliser `useTranslation('partenariat')` et remplacer toutes les chaînes en dur par des appels `t(...)`. Les `expertises` et `faqItems` sont restructurés pour lire titre/description/points/question/réponse depuis i18n (via `t('services.0.title')` etc. ou via `t('services', { returnObjects: true })`).

Le toggle de langue existant (LanguageToggle dans le header) bascule alors la page entière.

### Fichiers touchés

```text
src/pages/Partenariat.tsx                     (sous-titre + i18n)
src/components/partenariat/ContactProModal.tsx (fusion tel/wa + i18n + invoke notif)
src/i18n/index.ts                              (+ namespace partenariat)
src/i18n/locales/fr/partenariat.json           (nouveau)
src/i18n/locales/en/partenariat.json           (nouveau)
supabase/functions/notify-partenariat-contact/index.ts (nouveau)
supabase/config.toml                           (verify_jwt = false pour la nouvelle fn)
```

Aucune migration DB nécessaire (on continue d'insérer dans `contact_requests`).
