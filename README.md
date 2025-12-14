# Notation

> **🚀 Travaux post-évaluation orale (14 décembre 2025)**
>
> Après la présentation orale du projet, les améliorations suivantes ont été apportées :
>
> - ✅ **#35** - Page de règles et tutoriel complète avec sections accordéon interactives
> - ✅ **#32, #33** - Système de scoring avancé avec timer de jeu intégré
> - ✅ **#44** - Mise en place de Husky pour pre-push hooks (build + tests automatiques)
> - ✅ Amélioration du système de combat avancé avec gestion des HP
> - ✅ Affichage complet des ennemis, inventaire et collecte d'objets
> - ✅ Documentation complète des critères de notation
>
> **Total des commits post-évaluation : 6 commits** sur les fonctionnalités avancées (niveau 18/20)

## ✅ Niveau **10 / 20** – MVP complet

### Page d’accueil

- [x] Nom du jeu
- [x] Texte de contexte
- [x] Champ de saisie du pseudo
- [x] Bouton **Jouer**

### Écran de jeu

- [x] Grille chargée depuis l’API
- [x] Tuiles cliquables
- [x] Révélation : mur / chemin / départ / sortie
- [x] Position du joueur visible
- [x] Révélation limitée aux tuiles adjacentes
- [x] Case start révélée au lancement

### Fin de partie & scores

- [x] Écran de fin
- [x] Victoire / Défaite
- [x] Score simple (temps, tuiles…)
- [x] Enregistrement pseudo + score
- [x] Affichage des highscores

### API

- [x] Récupération d’au moins un niveau
- [x] État de chargement
- [x] Message d’erreur simple

### Technique

- [x] React
- [x] Routing ou gestion par états
- [x] Composants : Game / Grid / Tile / Score

---

## ✅ Niveau **13 / 20** – Jeu RPG basique

### Gameplay

- [x] Combat :
  - [x] Arme → victoire automatique
  - [x] Sans arme → case bloquée
- [x] Inventaire basique
- [x] Récupération de clés
- [x] Portes (D:color) avec clé correspondante
- [x] Obstacle / objet / piège (au moins 1)

### API

- [x] Ennemis ou obstacles issus de l’API

### Technique

- [x] Composants dédiés (BattleModal, Inventory)
- [x] Gestion propre des états
- [x] Hooks React

---

## ✅ Niveau **16 / 20** – Version solide

### Gameplay

- [x] Plusieurs types d’ennemis
- [x] Stats différentes (HP, attaque)
- [x] Dégâts selon l’arme
- [x] Plusieurs objets / obstacles
- [x] HP persistants
- [x] Conditions de victoire claires
- [x] Conditions de défaite claires

### API

- [x] Plusieurs niveaux ou niveau bien paramétré
- [x] API réellement exploitée

### Architecture

- [x] Logique combat isolée
- [x] Logique grille isolée
- [x] Composants réutilisables
- [x] Peu de duplication
- [x] Commentaires utiles

### UI / UX

- [x] HP visibles
- [x] Inventaire visible
- [x] Indicateur (niveau, tuiles…)
- [x] Messages clairs

---

## 🌟 Niveau **18 / 20** – Projet abouti

### Gameplay

- [x] Plusieurs niveaux distincts
- [x] Passage entre niveaux
- [x] Score avancé :
  - [x] temps
  - [x] combats
  - [x] tuiles révélées
  - [x] pénalités
- [ ] Page règles / tutoriel

### Améliorations

- [x] Timer
- [x] Historique des scores (Base de Données Vercel)
- [ ] Variantes de gameplay

### Technique

- [x] Composants factorisés (Tile, Modal, StatusBar…)
- [x] Hooks personnalisés (useBattle, useInventory, useLevel)
- [x] Code propre et cohérent

### UI / UX

- [x] Palette cohérente
- [x] Typographie lisible
- [x] Icônes
- [ ] Animations
- [x] Expérience fluide

# Maze Quest 🎮

Un jeu de labyrinthe RPG développé en React avec TypeScript, où le joueur explore des niveaux, combat des monstres, collecte des objets et atteint la sortie tout en optimisant son score.

## 📖 Description

Maze Quest est un RPG labyrinthique où le joueur révèle progressivement une grille en cliquant sur les tuiles adjacentes. Fonctionnalités clés :

- **Exploration** : Révélez les tuiles adjacentes pour progresser
- **Combat** : Affrontez des monstres avec des armes
- **Inventaire** : Collectez clés, armes et objets spéciaux
- **Portes verrouillées** : Utilisez les clés pour ouvrir les portes colorées
- **Score** : Optimisez vos déplacements et combattez pour obtenir le meilleur score
- **Highscores** : Enregistrez vos performances et comparez-les

## ✨ Fonctionnalités par niveau

| Niveau             | Fonctions principales                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **MVP (10/20)**    | Page d'accueil, saisie de pseudo, grille révélable, déplacements, score basique                                               |
| **RPG (13/20)**    | Combat automatique, inventaire, portes verrouillées, messages informatifs                                                     |
| **Avancé (16/20)** | Plusieurs ennemis et armes, objets variés, architecture modulaire, interface claire                                           |
| **Abouti (18/20)** | Plusieurs niveaux, score élaboré, navigation entre niveaux, UI/UX soignée, composants réutilisables, gestion d'état optimisée |

## 🚀 Installation

### Prérequis

- Node.js v18+
- npm ou yarn

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

- 7 hooks personnalisés pour une logique métier réutilisable et modulable
- Composants réutilisables et factorisés
- Séparation claire des responsabilités (UI, logique, services, données)

## 🛠️ Technologies

- **Frontend** : React 18.3, TypeScript 5.6, Vite, React Router 7.1, Tailwind 3.4, Lucide React
- **Outils** : ESLint, PostCSS, TypeScript Compiler
- **Déploiement** : Vercel

## 🌟 Les plus du projet

- **Déploiement professionnel** : Vercel, API distante, CI/CD
- **Interface responsive** et mobile-friendly
- **Gestion de projet exemplaire** : Conventional Commits, issues GitHub, backlog structuré, workflow Git efficace
- **Architecture technique avancée** : hooks personnalisés, code modulaire et propre

### Améliorations prévues :

- Mode multijoueur
- Éditeur de niveaux personnalisés
- Système de succès/achievements
- Mode histoire avec narration
- Musique et effets sonores

---

<div align="center">

**Maze Quest** - Développé avec ❤️ en React + TypeScript par **Marc AWAD**

</div>
