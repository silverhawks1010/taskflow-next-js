# TaskFlow Next.js

Version Next.js du TP3 React, réalisée avec l’App Router. La version Vite d’origine reste indépendante dans `taskflow/`.

## Installation et lancement

Prérequis : Node.js 20.9 ou supérieur et npm.

```sh
npm install
npm run dev
```

Ouvrir <http://localhost:3000>. Les exemples de projets et tâches sont dans `db.json`.

## Fonctionnalités

- Liste des projets, création, modification et suppression.
- Tâches par projet : ajout avec priorité et échéance, changement de statut et suppression.
- Filtres par statut et tri des tâches par échéance.
- Statistiques par statut et par projet, page À propos et page 404.
- Minuteur de concentration et thème clair/sombre mémorisé.
- Pages rendues sur le serveur ; seuls les composants interactifs sont envoyés au navigateur.

Les actions écrivent dans le fichier local `db.json` : cette persistance sert à l’exercice en local. Pour un déploiement multi-instance, remplacer ce stockage fichier par une base de données hébergée.

## Vérifications

```sh
npm run lint
npm run build
```
