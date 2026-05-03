## Repositionnement /partenariat — Mariable Studio Social Media Mariage

Refonte complète du pricing et du discours de la page `/partenariat` pour passer du modèle annuaire/adhésion (120€/an) à un modèle **studio social media spécialisé mariage** (création de contenu, community management, mise en avant Mariable).

### 1. Nouveau Hero (haut de page)

- H1 : **« Studio social media spécialisé mariage »**
- Sous-titre : « Devenez le lieu (ou le traiteur) que les futurs mariés veulent absolument sur Instagram. Création de contenu, community management et mise en avant éditoriale. »
- Cible explicite : « Pour les **lieux de réception** et **traiteurs mariage** »
- 2 CTA : « Voir les offres » / « Demander un devis »

### 2. Section Constat (réécriture)

Remplacer les 4 étapes actuelles par le constat marché :
- Les couples cherchent leur inspiration sur Instagram
- Les prestataires n'ont pas le temps ni le réflexe de produire du contenu
- Être listé ne suffit plus : il faut être **désirable**
- L'image et la narration > le référencement

### 3. Section 3 piliers (nouveau)

Présentation des 3 expertises du studio (avant le pricing) :
1. **Création de contenu** — reels, photos, direction artistique, mise en scène
2. **Community management** — gestion Instagram, feed cohérent, présence régulière
3. **Mise en avant Mariable** — publication éditoriale, curation, effet vitrine

### 4. Section Pricing — 3 packs (REMPLACE l'existant)

Suppression complète de l'« Adhésion partenaire 120€/an » et de la carte « Offres premium / sur demande ».

| Pack | Prix | Cible | Inclus |
|---|---|---|---|
| **Essentiel** | 290€/mois | Premier pas, traiteurs/petits lieux | 4 posts Instagram/mois, 2 stories/semaine, ligne éditoriale, reporting |
| **Signature** ⭐ (mis en avant) | **490€/mois** | Pack pivot — le plus vendable | **4 reels + 8 posts + stories illimitées + community management complet + mise en avant Mariable** |
| **Studio** | Sur devis | Lieux établis, refonte image | Shooting trimestriel sur site, direction artistique, refonte feed, campagnes saisonnières, site web optionnel |

CTA : « Démarrer » (Essentiel/Signature → formulaire) / « Demander un devis » (Studio → contact).

### 5. Focus Pack Signature (nouvelle section dédiée)

Section détaillée pour le pack pivot 490€/mois — celui qui doit convertir :

**« Pack Signature — La présence Instagram qui transforme votre lieu en référence »**

Livrables mensuels :
- 4 reels mariage (montage + storytelling)
- 8 posts feed (photos retouchées + copywriting)
- Stories illimitées (coulisses, événements, témoignages)
- Calendrier éditorial mensuel
- Community management : réponses DM/commentaires
- 1 mise en avant Mariable/mois (post + story)
- Reporting mensuel

Engagement : 3 mois minimum. Setup offert.

### 6. Mots-clés SEO intégrés

Injecter naturellement dans titres, sous-titres, meta et JSON-LD :
- **création contenu Instagram traiteur mariage**
- **community management lieu de réception**
- **reels mariage prestataires**
- agence social media mariage (secondaire)

Mise à jour `<Helmet>` :
- Title : `Studio social media mariage — Création contenu Instagram lieux & traiteurs | Mariable`
- Description : `Agence social media spécialisée mariage. Création de reels, community management Instagram et mise en avant éditoriale pour lieux de réception et traiteurs.`
- JSON-LD `Service` avec `serviceType: "Social media management for wedding venues and caterers"`.

### 7. Sections à conserver / adapter

- ✅ Garder la section « Éléments inclus » (accordions) → adapter le contenu pour parler reels, CM, contenu
- ❌ Supprimer la section « Alternative accessible aux articles sponsorisés » (basée sur 120€/an)
- ✅ Garder « En résumé » → reformuler bénéfices (« Image plus forte / Présence constante / Désirabilité »)
- ✅ Garder section « Exemples posts/stories » → la mettre plus en valeur (preuve sociale)
- ✅ Garder formulaire d'inscription (déjà connecté à `notify-new-professional`)

### 8. Détails techniques

- Fichier unique : `src/pages/Partenariat.tsx`
- Aucun changement DB, aucun changement de routes
- Garder design system : `bg-premium-base`, `text-premium-sage`, `font-serif` (Playfair), `rounded-none`
- Mettre en avant le pack Signature visuellement (badge « Le plus choisi », bordure sage, échelle légèrement supérieure)
- Conserver le formulaire `ProfessionalRegistrationForm` existant et ses notifications email

### 9. Mémoire à mettre à jour

Remplacer `mem://business-model/professional-partnership-membership` (120€/an) par une nouvelle mémoire `mem://business-model/mariable-studio-social-media` décrivant les 3 packs (290 / 490 / sur devis) et le positionnement studio.

### Hors scope

- Pas de page de checkout / paiement Stripe (les conversions passent par formulaire + devis comme aujourd'hui)
- Pas de modification des fiches prestataires existantes ni du marketplace
- Pas de touche aux autres pages (Footer, AccueilProfessionnels, etc.) sauf si un lien explicite réfère au tarif 120€/an — à vérifier au moment de l'implémentation
