export const enemiesCatalog = [
  {
    type: "goblin",
    name: "Gobelin des couloirs",
    hp: 14,
    attack: 3,
    description: "Rapide mais fragile.",
    icon: "🟢",
  },
  {
    type: "slime",
    name: "Slime visqueux",
    hp: 10,
    attack: 2,
    description: "Lent et collant.",
    icon: "🟣",
  },
  {
    type: "orc",
    name: "Orc brutal",
    hp: 20,
    attack: 5,
    description: "Très dangereux.",
    icon: "🔴",
  },
]

export const obstaclesCatalog = [
  {
    type: "fire",
    name: "Flammes",
    requiredItem: "water_bucket",
    description: "Flammes à éteindre.",
    icon: "🔥",
  },
  {
    type: "rock",
    name: "Rochers",
    requiredItem: "pickaxe",
    description: "Rochers à briser.",
    icon: "🪨",
  },
  {
    type: "water",
    name: "Eau profonde",
    requiredItem: "swim_boots",
    description: "Eau à traverser.",
    icon: "💧",
  },
]

export const itemsCatalog = [
  {
    id: "key_red",
    kind: "key",
    color: "red",
    name: "Clé rouge",
    description: "Ouvre porte rouge",
    icon: "🟥",
  },
  {
    id: "key_blue",
    kind: "key",
    color: "blue",
    name: "Clé bleue",
    description: "Ouvre porte bleue",
    icon: "🟦",
  },
  {
    id: "water_bucket",
    kind: "item",
    name: "Seau d'eau",
    description: "Éteint le feu",
    icon: "🪣",
  },
  {
    id: "pickaxe",
    kind: "item",
    name: "Pioche",
    description: "Casse les rochers",
    icon: "⛏️",
  },
  {
    id: "swim_boots",
    kind: "item",
    name: "Bottes amphibies",
    description: "Traverse l'eau",
    icon: "🥾",
  },
]
