# Inscription professionnelle : pourquoi ça ne marche pas

Le test avec `testmariable2@yopmail.com` a été vérifié directement dans la base :

- Le choix « Professionnel » est bien enregistré au moment de l'inscription (la valeur `b2b` est présente sur le compte créé le 7 septembre à 13h15).
- En revanche, la fiche utilisateur (le profil consulté par l'application) **ne possède pas encore le champ « type de compte »** : il fait partie des modifications préparées dans ce brouillon, pas encore appliquées à la vraie base.

Conséquence : l'application lit un type de compte inexistant, retombe sur « Particulier », et la connexion renvoie vers le tableau de bord classique. Le code de l'espace pro est déjà en place, il lui manque uniquement la donnée.
