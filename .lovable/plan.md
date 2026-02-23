
# Ajout d'encadres informatifs sur /register et /dashboard/installer-app

## 1. Page /register (Register.tsx)

Ajouter un encadre informatif juste avant le formulaire (apres le CardDescription, ligne 161), dans le CardHeader ou juste avant le CardContent :

**Contenu de l'encadre :**
> Utilisation des outils en ligne recommandee sur ordinateur ou tablette - sauf l'appli du Jour-J specialement concue pour mobile !

- Style : petit `Alert` ou encadre avec une icone (Monitor/Smartphone) et fond leger (`bg-blue-50` ou `bg-wedding-olive/5`)
- Place entre le CardDescription (ligne 159-161) et le CardContent (ligne 163)

**Fichier :** `src/pages/auth/Register.tsx`, insertion vers ligne 162

---

## 2. Page /dashboard/installer-app (InstallAppPage.tsx)

Modifier la section "DesktopInstructions" (lignes 157-172) et la section lien partageable (lignes 202-215) pour distinguer deux cas :

### a) URL futurs maries
Dans le bloc desktop (ligne 167-170), garder `mariable.fr/dashboard` mais preciser que c'est pour les futurs maries.

### b) URL invites/temoins/prestataires
Ajouter une precision dans le bloc "Partagez ce tutoriel" ou juste en dessous : pour les invites, temoins et prestataires a qui vous partagez l'appli du Jour-J, c'est le lien unique que vous leur partagez (le lien specifique de leur mariage).

**Fichier :** `src/pages/dashboard/InstallAppPage.tsx`
- Modifier le bloc DesktopInstructions (lignes 162-170) pour ajouter la distinction futurs maries vs invites
- Modifier ou completer le bloc lien partageable (lignes 202-215)

---

## Details techniques

| Fichier | Modification |
|---|---|
| `src/pages/auth/Register.tsx` | Ajouter un encadre info (Alert) entre CardDescription et CardContent, avec icone Monitor/Smartphone |
| `src/pages/dashboard/InstallAppPage.tsx` | Mettre a jour DesktopInstructions avec 2 cas (futurs maries = mariable.fr/dashboard, invites = lien unique partage) |

Aucune dependance externe a ajouter. Utilisation des composants Alert et icones Lucide deja presents dans le projet.
