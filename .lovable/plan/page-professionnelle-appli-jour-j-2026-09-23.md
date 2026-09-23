# Page professionnelle « Appli Jour-J »

## Objectif
Créer une page publique mobile-first à l’adresse **`/pro/feuille-de-route-jour-j`**, destinée aux wedding planners, coordinatrices, lieux de réception et agences événementielles. Elle doit convertir vers un compte professionnel tout en devenant la page centrale du cluster SEO « feuille de route mariage à partager ».

## Page et expérience
- Reprendre le contenu fourni avec une hiérarchie claire : promesse, problème des versions, fonctionnement en 5 étapes, partage sans compte, cas d’usage par métier, écosystème Mariable, raison d’être, FAQ et dernier appel à l’action.
- Conserver la direction artistique éditoriale de Mariable : Playfair Display, vert sauge, beige très clair, noir éditorial, angles droits et même header/footer que le site.
- Mettre le CTA principal **« Essayer l’appli Jour-J »** au-dessus de la ligne de flottaison sur mobile et le relier à **`/register-gratuit?type=pro`**.
- Présenter clairement l’inscription professionnelle gratuite puis **Mariable Pro à 149 €/an**, sans inventer de durée d’essai non confirmée.
- Ajouter une capture interactive intégrée à la page : bascule **Vue complète / Vue DJ**, planning mobile, tâches assignées et documents. Cette démonstration utilise des données fictives et ne nécessite aucun compte.
- Ajouter un modèle Excel de feuille de route téléchargeable depuis la page, basé sur le format déjà utilisé par l’import Jour-J : heure, tâche et personne assignée.

## Fonctionnalités vérifiées et promesses
- Le lien public existant est permanent, accessible sans compte et permet déjà de filtrer les tâches par membre d’équipe.
- Ajouter l’actualisation automatique du lien partagé lorsque le planning, l’équipe, les documents ou les informations du mariage changent.
- Étendre proprement la diffusion temps réel aux données nécessaires, conserver les règles d’accès existantes et nettoyer chaque abonnement à la fermeture de la page.
- Ne pas promettre qu’un prestataire voit uniquement ses tâches par défaut : présenter correctement le filtre qu’il peut sélectionner.

## SEO et contenu
- Titre SEO centré sur **« feuille de route mariage prestataires »** et H1 contenant la notion de partage.
- Answer box de 2–3 phrases immédiatement sous le H1 pour les recherches conversationnelles et les moteurs IA.
- Intégrer naturellement les quick wins pertinents : lien partagé, aucun compte prestataire, dernière version du déroulé et filtre par personne.
- Ajouter métadescription, canonical auto-référente sur `https://mariable.fr`, Open Graph, fil d’Ariane JSON-LD, Service JSON-LD et FAQPage pour les questions fournies.
- Employer le vocabulaire pro dans les titres secondaires : conducteur, feuille de service, run of show, coordination jour J.
- Ajouter la nouvelle URL aux deux générateurs de sitemap et au sitemap public.

## Maillage interne
- Depuis la page, relier les quatre articles professionnels déjà publiés :
  - Alternative à Excel pour le déroulé ;
  - Comparatif des logiciels wedding planner ;
  - Coordination jour J ;
  - Lieux de réception.
- Relier aussi les modules utiles : inscription Pro, offre Mariable Pro, planning Jour-J, équipe et documents.
- Ajouter dans chacun des quatre articles un lien contextuel vers la nouvelle page avec l’ancre **« partager votre feuille de route »**.
- Ajouter un accès visible depuis la rubrique Conseils professionnels et depuis la présentation de Mariable Pro, sans perturber les parcours couples.

## Technique
- Créer une page React dédiée et un petit composant de démonstration visuelle, sans refactoriser les pages qui fonctionnent.
- Ajouter la route publique dans le routeur.
- Mettre à jour la page publique réellement utilisée par les liens générés (`/jour-m-vue/:token`) pour recevoir les changements automatiquement.
- Appliquer une migration Supabase limitée à l’activation Realtime des tables strictement nécessaires ; aucune nouvelle table.
- Mettre à jour les contenus des quatre articles existants sans modifier leurs titres, couvertures ou autres paragraphes.

## Vérification
- Tester la page sur mobile et ordinateur : CTA, capture interactive, téléchargement du modèle, liens internes, FAQ et absence de débordement.
- Vérifier que le CTA ouvre l’inscription avec le profil professionnel sélectionné.
- Vérifier sur un planning partagé que l’ajout ou la modification d’une tâche apparaît sans recharger la page.
- Contrôler les métadonnées, données structurées, sitemap, erreurs visibles et erreurs console.
