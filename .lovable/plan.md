
## Plan de corrections et nouvelles fonctionnalites

### Resume des demandes

| Demande | Type | Priorite | Statut |
|---------|------|----------|--------|
| 1. Moodboard absent du menu dashboard | Bug | Haute | ✅ Terminé |
| 2. Export PDF moodboard deforme les images | Bug | Haute | ✅ Terminé |
| 3. Double RSVP (Jour-J + Brunch) | Nouvelle fonctionnalite | Moyenne | ✅ Terminé |
| 4. Page mini-site /severineetolivier | Nouvelle fonctionnalite | Moyenne | ✅ Terminé |

---

### Implementations realisees

#### 1. Correction Moodboard menu sidebar
- Ajout d'un lien standalone "Moodboard" après "Plan de table" dans `DashboardSidebar.tsx`
- Icône Palette visible directement dans la navigation

#### 2. Correction Export PDF moodboard
- Utilisation de `html2canvas` pour capturer le moodboard visuellement
- L'export PDF préserve maintenant exactement l'apparence à l'écran
- Plus de déformation des images

#### 3. Double RSVP (sous-événements)
- Nouvelles tables BDD : `wedding_rsvp_sub_events` et `wedding_rsvp_sub_responses`
- Interface de création avec ajout d'événements secondaires (brunch, etc.)
- Formulaire public affichant les sous-événements avec participation séparée
- Page de réponses avec décomptes par sous-événement
- Export CSV incluant les données des sous-événements

#### 4. Page mini-site /severineetolivier
- One-pager mobile-friendly créé
- Header sticky avec navigation par ancres
- Sections : Hero, Programme (timeline), RSVP, Logements, Contact
- Design cohérent avec Mariable
- Countdown jusqu'au jour J
