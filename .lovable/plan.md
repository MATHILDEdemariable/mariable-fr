## Améliorations Mon Jour-J

4 chantiers indépendants sur `/mon-jour-m`.

---

### 1. Import des documents Dashboard → Jour J

**Constat** : deux silos séparés.

- Dashboard → table `wedding_documents` (par `user_id`, types : devis/contrat/facture/autre, analyse IA)
- Jour J → table `coordination_documents` (par `coordination_id`, category `jour-m`, upload manuel dans bucket `coordination-files`)

**Solution simple** (pas de migration de données, pas de duplication) :

- Dans l'onglet **Documents** de Mon Jour-J, ajouter un bouton **« Importer depuis mon Dashboard »**.
- Ouvre une modale qui liste les `wedding_documents` de l'utilisateur (cases à cocher, filtre par type).
- Au clic « Importer la sélection » : on crée une ligne dans `coordination_documents` qui **réutilise le `file_url` existant** (pas de re-upload), copie `title`, `description`, et marque `category='jour-m'`. Un champ `source_document_id` (uuid nullable, FK vers `wedding_documents`) garde la traçabilité et évite les doublons.
- Badge « Importé du Dashboard » sur les cards concernées.

**Migration** : ajouter colonne `source_document_id uuid` (nullable, index) sur `coordination_documents`.

---

### 2. Planning multi-jours (vendredi / samedi / dimanche)

**Constat** : `coordination_planning` n'a qu'un `start_time` (text, format HH:mm) — pas de notion de jour.

**Solution simple** :

- Ajouter colonne `event_day text` sur `coordination_planning` (valeurs libres : `J-1`, `Jour J`, `J+1`, ou date ISO). Default `Jour J` pour rétro-compatibilité.
- Dans `MonJourMPlanningContent` : ajouter un **sélecteur d'onglets jours** en haut (`J-1`  / `Jour J`  / `J+1` ), avec bouton **« + Ajouter un jour »** qui permet de créer un libellé custom.
- Chaque étape se voit attribuer un jour à la création (par défaut le jour actif). Affichage filtré par onglet actif.
- Export PDF : sections séparées par jour.

**Hors scope** : dates calendaires complètes — on reste sur des libellés textuels pour rester simple.

---

### 3. Bug saisie durée + menu déroulant

**Constat** : champ `<input type="number">` libre dans `EditableEventCard.tsx` (l.202+) — perte de focus / valeurs vides qui cassent l'enregistrement.

**Solution simple** :

- Remplacer l'input number par un `**<Select>**` avec presets : `5, 10, 15, 20, 30, 40, 45, 50, 60, 75, 90, 120, 150, 180, 240 min`.
- Garder une option **« Personnalisé »** qui ouvre un petit input number (avec `min=1`, validation `Number.isFinite`, fallback à la valeur précédente si invalide) — pour les cas hors presets.
- Idem dans `EditableTimelineEvent.tsx` et `CustomBlockDialog.tsx`.

---

### 4. Ajout en masse de membres d'équipe

**Constat** : `/mon-jour-m/equipe` n'ajoute qu'un membre à la fois via modale.

**Solution simple** :

- Bouton **« Ajout en masse »** à côté de « Ajouter un membre » dans `SimpleTeamManager.tsx`.
- Ouvre une modale avec **un grand `<Textarea>**` + placeholder explicite :
  ```
  Marie Dupont, Témoin, marie@mail.com, 06 12 34 56 78
  Paul Martin, Famille
  Sophie L., Co-organisateur, sophie@mail.com
  ```
- Parsing simple côté client : une ligne = un membre, split par `,`. Champs : `nom, rôle, email?, téléphone?`.
- Preview tableau avant validation (avec détection des rôles invalides → mappés sur « Autre personne »).
- Insert batch dans `coordination_team`.

---

### Détails techniques

**Migrations Supabase** :

```sql
ALTER TABLE coordination_documents 
  ADD COLUMN source_document_id uuid REFERENCES wedding_documents(id) ON DELETE SET NULL;
CREATE INDEX idx_coord_docs_source ON coordination_documents(source_document_id);

ALTER TABLE coordination_planning 
  ADD COLUMN event_day text NOT NULL DEFAULT 'Jour J';
CREATE INDEX idx_coord_planning_day ON coordination_planning(coordination_id, event_day);
```

**Fichiers touchés** :

- `src/components/mon-jour-m/MonJourMDocuments.tsx` → bouton + modale d'import Dashboard
- nouveau `src/components/mon-jour-m/ImportFromDashboardModal.tsx`
- `src/components/mon-jour-m/MonJourMPlanningContent.tsx` → tabs jours + filtre
- `src/components/wedding-day/components/EditableEventCard.tsx`, `EditableTimelineEvent.tsx`, `CustomBlockDialog.tsx` → Select durée
- `src/components/mon-jour-m/SimpleTeamManager.tsx` → bouton + modale bulk
- nouveau `src/components/mon-jour-m/BulkAddTeamModal.tsx`

**Hors scope** :

- Synchronisation bidirectionnelle Dashboard ↔ Jour J (one-way copy uniquement)
- Refonte UI du planning, drag & drop entre jours (juste filtrage)
- Parser CSV/Excel pour l'équipe (textarea simple suffit)
- Analyse IA des documents importés (déjà existante côté Dashboard)

---

### Validation à la livraison

1. Documents Dashboard apparaissent dans la modale d'import, sélection multiple OK, badge visible
2. Création d'étape avec 3 jours différents, filtrage par onglet correct
3. Modification de durée via Select instantanée, plus de bug de focus
4. Coller 10 lignes dans le bulk team → 10 membres créés en un clic