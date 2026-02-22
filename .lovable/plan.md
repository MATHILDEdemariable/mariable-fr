

# Fix : Ajouter les politiques RLS admin sur vendor_messages

## Probleme identifie

La table `vendor_messages` a uniquement des politiques RLS basees sur `auth.uid() = user_id`. L'admin ne voit que ses propres messages. Il manque des politiques permettant aux admins de voir, modifier et supprimer tous les messages.

## Ce qui va etre fait

### Migration SQL : ajouter 3 politiques RLS admin

Ajouter des politiques utilisant la fonction `is_admin()` deja existante dans le projet :

- **SELECT** : les admins peuvent voir tous les messages
- **UPDATE** : les admins peuvent modifier tous les messages (marquer lu/non lu)
- **DELETE** : les admins peuvent supprimer tous les messages

```sql
CREATE POLICY "Admins can view all messages"
  ON public.vendor_messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all messages"
  ON public.vendor_messages FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete all messages"
  ON public.vendor_messages FOR DELETE
  USING (public.is_admin());
```

Aucun fichier code a modifier. Le composant `VendorMessagesAdmin.tsx` fonctionne deja correctement, il lui manquait simplement les permissions en base.

| Element | Action |
|---|---|
| Table `vendor_messages` | Ajouter 3 politiques RLS pour les admins (SELECT, UPDATE, DELETE) |
| Code frontend | Aucune modification necessaire |

Apres cette migration, les 4 messages apparaitront dans l'onglet "Messages Utilisateurs".
