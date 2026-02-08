

## Plan d'optimisation Supabase - Reduction de l'Egress

### Diagnostic resume

L'analyse du code revele plusieurs sources majeures de consommation excessive :

| Probleme identifie | Impact estime | Fichiers concernes |
|-------------------|---------------|-------------------|
| Appels `getUser()` repetes | 45% Auth Egress | 95 fichiers avec 620+ occurrences |
| SELECT * au lieu de colonnes specifiques | 30% PostgREST Egress | 96 fichiers avec 770+ occurrences |
| Absence de cache global React Query | 15% repetitions | App.tsx + hooks |
| `onAuthStateChange` en double | 10% Auth Egress | 16 fichiers avec 85 occurrences |
| LazyVendorCard checkTrackingStatus | 5% par carte visible | LazyVendorCard.tsx |

---

### Phase 1 : Centralisation Auth (Impact : -45% Auth Egress)

**Probleme principal** : Chaque composant appelle `supabase.auth.getUser()` ou `getSession()` independamment, generant des requetes reseau a chaque montage.

**Solution** : Creer un `AuthProvider` centralise avec React Context.

**Fichier a creer** : `src/contexts/AuthContext.tsx`

Le provider :
- Appelle `getSession()` une seule fois au demarrage
- Ecoute `onAuthStateChange` une seule fois
- Expose `user`, `session`, `loading` via Context
- Tous les composants utilisent le hook `useAuth()` au lieu de `supabase.auth.getUser()`

**Fichiers a modifier** (liste non exhaustive des plus impactants) :
- `src/hooks/useUserProfile.ts`
- `src/components/home/PremiumHeader.tsx`
- `src/components/vendors/LazyVendorCard.tsx`
- `src/pages/dashboard/MoodboardPage.tsx`
- Et environ 90 autres fichiers

---

### Phase 2 : Configuration React Query optimale (Impact : -15% requetes)

**Probleme** : Le QueryClient utilise les valeurs par defaut sans cache global optimise.

**Fichier a modifier** : `src/App.tsx`

```text
Configuration actuelle :
  const queryClient = new QueryClient();

Configuration optimisee :
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,         // 5 minutes
        gcTime: 10 * 60 * 1000,           // 10 minutes
        refetchOnWindowFocus: false,      // Eviter refetch a chaque focus
        refetchOnReconnect: false,        // Eviter refetch a chaque reconnexion
        retry: 1,                          // Max 1 retry au lieu de 3
      },
    },
  });
```

---

### Phase 3 : Selection specifique des colonnes (Impact : -30% PostgREST Egress)

**Probleme** : 770+ occurrences de `select('*')` chargent toutes les colonnes meme quand 2-3 suffisent.

**Exemples de corrections prioritaires** :

| Fichier | Avant | Apres |
|---------|-------|-------|
| useUserProfile.ts | `.select('*')` | `.select('id, first_name, last_name, subscription_type, subscription_expires_at')` |
| LazyVendorCard.tsx | `.select('id')` checkTrackingStatus | Supprimer cet appel, utiliser un batch |
| GuestListManager.tsx | `.select('*')` | `.select('id, name, email, status')` |
| vendors_tracking_preprod | `.select('id')` par carte | Charger la liste complete une fois |

---

### Phase 4 : Optimisation LazyVendorCard (Impact : -5% par page de resultats)

**Probleme critique** : Chaque carte visible fait 2 appels :
1. `supabase.auth.getUser()` pour verifier la connexion
2. `vendors_tracking_preprod` pour verifier le statut de suivi

Pour 12 cartes par page = 24 appels supplementaires.

**Solution** :
1. Utiliser le hook `useAuth()` centralise (Phase 1)
2. Creer un hook `useVendorTrackingStatus` qui charge TOUS les suivis de l'utilisateur en une requete
3. Passer la liste des suivis en prop depuis le parent

---

### Phase 5 : Nettoyage des listeners onAuthStateChange

**Probleme** : 16 fichiers creent leurs propres listeners, causant des appels multiples.

**Solution** : Supprimer tous les `onAuthStateChange` locaux et utiliser l'AuthProvider.

**Fichiers a nettoyer** :
- `src/pages/auth/Register.tsx`
- `src/pages/auth/Login.tsx`
- `src/components/Header.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/pages/ProfessionnelsMariable.tsx`
- `src/components/vibe-wedding/VibeWeddingResultsImproved.tsx`
- `src/pages/dashboard/CoordinationPage.tsx`
- `src/pages/LandingPage.tsx`
- `src/components/home/GuidesSection.tsx`
- `src/components/cart/CartProvider.tsx`
- `src/pages/Demo.tsx`
- `src/pages/CoordinationJourJ.tsx`
- `src/components/home/PremiumHeader.tsx`
- `src/components/vibe-wedding/VibeWeddingChat.tsx`
- `src/pages/prestataire/slug.tsx`
- `src/pages/Preview.tsx`

---

### Resume des fichiers a creer/modifier

| Action | Fichier |
|--------|---------|
| Creer | `src/contexts/AuthContext.tsx` |
| Modifier | `src/App.tsx` (QueryClient config + AuthProvider) |
| Modifier | `src/hooks/useUserProfile.ts` |
| Modifier | `src/components/vendors/LazyVendorCard.tsx` |
| Creer | `src/hooks/useVendorTrackingList.ts` |
| Modifier | 16 fichiers avec onAuthStateChange |
| Modifier | ~50 fichiers prioritaires avec SELECT * |

---

### Ordre d'implementation recommande

1. **AuthContext** - Impact immediat sur 45% du probleme
2. **QueryClient optimise** - Changement simple, impact rapide
3. **LazyVendorCard** - Reduction significative sur les pages de recherche
4. **SELECT specifiques** - A faire progressivement, fichier par fichier

---

### Resultat attendu

| Metrique | Avant | Apres | Reduction |
|----------|-------|-------|-----------|
| Auth Egress | 45.5 MB | ~10 MB | -78% |
| PostgREST Egress | 46.9 MB | ~15 MB | -68% |
| Total Egress | ~103 MB | ~30 MB | -70% |

---

### Details techniques

**AuthContext - Fonctionnement** :

Le provider centralise :
1. Un seul `getSession()` au demarrage de l'app
2. Un seul listener `onAuthStateChange`
3. Stockage de `user` et `session` dans le state React
4. Tous les composants accedent via `useAuth()` sans appel reseau

**Batch des suivis prestataires** :

Au lieu de verifier chaque carte individuellement :
1. Charger `vendors_tracking_preprod` une seule fois pour l'utilisateur
2. Creer un Set d'IDs de prestataires suivis
3. Passer ce Set aux cartes via Context ou props
4. Chaque carte fait une simple verification locale `isTracked = trackedIds.has(vendorId)`

