# Maze Quest 🎮

Un jeu de labyrinthe RPG développé en React avec TypeScript, où le joueur explore des niveaux, combat des monstres, collecte des objets et atteint la sortie tout en optimisant son score.

## 📖 Description

Maze Quest est un RPG labyrinthique où le joueur révèle progressivement une grille en cliquant sur les tuiles adjacentes. Fonctionnalités clés :

* **Exploration** : Révélez les tuiles adjacentes pour progresser
* **Combat** : Affrontez des monstres avec des armes
* **Inventaire** : Collectez clés, armes et objets spéciaux
* **Portes verrouillées** : Utilisez les clés pour ouvrir les portes colorées
* **Score** : Optimisez vos déplacements et combattez pour obtenir le meilleur score
* **Highscores** : Enregistrez vos performances et comparez-les

## ✨ Fonctionnalités par niveau

| Niveau | Fonctions principales |
|--------|----------------------|
| **MVP (10/20)** | Page d'accueil, saisie de pseudo, grille révélable, déplacements, score basique |
| **RPG (13/20)** | Combat automatique, inventaire, portes verrouillées, messages informatifs |
| **Avancé (16/20)** | Plusieurs ennemis et armes, objets variés, architecture modulaire, interface claire |
| **Abouti (18/20)** | Plusieurs niveaux, score élaboré, navigation entre niveaux, UI/UX soignée, composants réutilisables, gestion d'état optimisée |

## 🚀 Installation

### Prérequis

* Node.js v18+
* npm ou yarn

### Étapes
```bash
git clone https://github.com/votre-username/maze-quest.git
cd maze-quest
npm install
npm run dev          # Lancer en dev
npm run build        # Build prod
npm run preview      # Prévisualiser le build
```

Créer un fichier `.env` :
```env
VITE_API_URL=https://votre-api.com
```

## 📁 Architecture du projet
```
maze-quest/
│
├── api/               # API locale (optionnelle)
├── data/              # Données statiques
├── public/            # Assets (images, icônes)
│
├── src/
│   ├── components/    # Composants réutilisables (Grid, Tile, Inventory, BattleModal, VictoryModal)
│   ├── hooks/         # Hooks personnalisés (useBattle, useGameLevel, useGameState, useHighscore, useInventory, usePlayerMovement, useTileInteraction)
│   ├── pages/         # Pages principales (HomePage, Game, NotFound)
│   ├── services/      # Services API (apiService)
│   ├── utils/         # Utilitaires (PlayerContext)
│   ├── App.tsx        # Composant racine
│   ├── main.tsx       # Entrée de l'application
│   └── index.css      # Styles globaux
│
├── .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**Points forts de l'architecture :**

* 7 hooks personnalisés pour une logique métier réutilisable et modulable
* Composants réutilisables et factorisés
* Séparation claire des responsabilités (UI, logique, services, données)

## 🛠️ Technologies

* **Frontend** : React 18.3, TypeScript 5.6, Vite, React Router 7.1, Tailwind 3.4, Lucide React
* **Outils** : ESLint, PostCSS, TypeScript Compiler
* **Déploiement** : Vercel

## 🌟 Les plus du projet

* **Déploiement professionnel** : Vercel, API distante, CI/CD
* **Interface responsive** et mobile-friendly
* **Gestion de projet exemplaire** : Conventional Commits, issues GitHub, backlog structuré, workflow Git efficace
* **Architecture technique avancée** : hooks personnalisés, code modulaire et propre

### Améliorations prévues :

* Mode multijoueur
* Éditeur de niveaux personnalisés
* Système de succès/achievements
* Mode histoire avec narration
* Musique et effets sonores

---

<div align="center">

**Maze Quest** - Développé avec ❤️ en React + TypeScript par **Marc AWAD**

</div>