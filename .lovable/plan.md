# Hero home : traduction EN alignée sur le FR

Le texte anglais du hero n'a pas suivi les dernières modifications françaises.

## Modifications (EN calqué sur le FR)
- Surtitre : « MARIABLE · THE WEDDING-DAY APP » (capitales comme en FR)
- Titre (2 lignes) : « Celebrate love. Elevate the wedding day. » (au lieu de « Simplify »)
- Promesse : « The app that centralizes and coordinates\nevery detail of the wedding day. »
- Texte secondaire : ajouter « thanks to a simple link » comme en FR
- Le retour à la ligne de la promesse sera réellement affiché (FR et EN)
- Correction FR au passage : « chaque détail » (sans s)

## Technique
- `src/i18n/locales/en/refonteJuillet.json` (clés `hero.*`), `fr` pour la coquille
- `HeroEditorial.tsx` : ajouter `whitespace-pre-line` sur le paragraphe promesse
- Vérifier FR/EN mobile et desktop (titre sur 2 lignes)
