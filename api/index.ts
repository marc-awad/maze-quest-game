import { VercelRequest, VercelResponse } from "@vercel/node"

let highscores: any[] = []

/* -------------------------------------------
   CATALOGUES ENNEMIS / OBSTACLES / ITEMS
-------------------------------------------- */
const enemiesCatalog = [
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

const obstaclesCatalog = [
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

const itemsCatalog = [
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

/* -------------------------------------------
   NIVEAUX
-------------------------------------------- */
const levels = [
  // Niveau 1
  {
    id: 1,
    name: "Initiation",
    description: "Petit niveau pour tests.",
    rows: 6,
    cols: 6,
    difficulty: "easy",
    hasCombat: false,
    hasKeys: false,
    hasObstacles: false,
    start: { row: 0, col: 0 },
    end: { row: 5, col: 5 },
    grid: [
      ["S", "C", "C", "W", "C", "C"],
      ["W", "W", "C", "W", "C", "W"],
      ["C", "C", "C", "C", "C", "C"],
      ["C", "W", "W", "W", "W", "C"],
      ["C", "C", "C", "C", "C", "C"],
      ["W", "W", "W", "C", "W", "E"],
    ],
    enemies: [],
    obstacles: [],
    items: [],
  },
  // Niveau 2
  {
    id: 2,
    name: "Galerie des gobelins",
    description: "Introduction aux combats et aux clés.",
    rows: 8,
    cols: 8,
    difficulty: "medium",
    hasCombat: true,
    hasKeys: true,
    hasObstacles: false,
    start: { row: 0, col: 0 },
    end: { row: 7, col: 7 },
    grid: [
      ["S", "C", "C", "M:goblin", "C", "C", "W", "C"],
      ["W", "W", "C", "W", "C", "W", "C", "C"],
      ["C", "C", "C", "C", "C", "C", "C", "W"],
      ["C", "W", "W", "W", "W", "C", "C", "C"],
      ["C", "C", "C", "K:red", "C", "W", "M:slime", "C"],
      ["W", "W", "C", "W", "D:red", "C", "C", "C"],
      ["C", "C", "C", "C", "C", "C", "W", "C"],
      ["W", "W", "W", "C", "W", "C", "C", "E"],
    ],
    enemies: [
      enemiesCatalog.find((e) => e.type === "goblin"),
      enemiesCatalog.find((e) => e.type === "slime"),
    ],
    obstacles: [],
    items: [itemsCatalog.find((i) => i.id === "key_red")],
  },
  // Niveau 3
  {
    id: 3,
    name: "Donjon élémentaire",
    description: "Clés, portes, combats et obstacles.",
    rows: 10,
    cols: 10,
    difficulty: "hard",
    hasCombat: true,
    hasKeys: true,
    hasObstacles: true,
    start: { row: 0, col: 0 },
    end: { row: 9, col: 9 },
    grid: [
      ["S", "C", "W", "K:red", "C", "M:goblin", "C", "W", "O:fire", "C"],
      ["C", "W", "W", "C", "D:red", "C", "C", "W", "C", "C"],
      ["C", "C", "M:slime", "C", "C", "I:pickaxe", "W", "C", "C", "W"],
      ["W", "C", "W", "C", "W", "C", "C", "C", "M:orc", "C"],
      ["C", "C", "C", "C", "O:rock", "W", "C", "W", "C", "C"],
      ["W", "W", "W", "C", "C", "C", "C", "W", "O:water", "C"],
      ["C", "C", "C", "W", "C", "I:swim_boots", "C", "W", "C", "C"],
      ["C", "M:slime", "C", "C", "C", "C", "C", "C", "C", "C"],
      ["C", "C", "W", "C", "W", "C", "C", "M:goblin", "W", "C"],
      ["W", "C", "C", "C", "W", "C", "C", "C", "W", "E"],
    ],
    enemies: enemiesCatalog,
    obstacles: obstaclesCatalog,
    items: itemsCatalog,
  },
]

/* -------------------------------------------
   HANDLER VERCEL
-------------------------------------------- */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || ""
  const method = req.method || "GET"

  // racine
  if (url === "/" && method === "GET")
    return res.json({ status: "ok", message: "FlipLabyrinth API is running" })

  // niveaux
  if (url.startsWith("/levels")) {
    if (method === "GET") {
      const parts = url.split("/")
      if (parts.length === 2 && parts[1]) {
        // /levels/:id
        const id = Number(parts[1])
        const level = levels.find((l) => l.id === id)
        if (!level) return res.status(404).json({ error: "Level not found" })
        return res.json(level)
      } else {
        // /levels
        const summary = levels.map((l) => ({
          id: l.id,
          name: l.name,
          description: l.description,
          rows: l.rows,
          cols: l.cols,
          difficulty: l.difficulty,
          hasCombat: l.hasCombat,
          hasKeys: l.hasKeys,
          hasObstacles: l.hasObstacles,
        }))
        return res.json(summary)
      }
    }
  }

  // highscores
  if (url.startsWith("/api/highscores")) {
    if (method === "GET") {
      const params = new URLSearchParams(url.split("?")[1])
      const levelId = params.get("levelId")
        ? Number(params.get("levelId"))
        : null
      const limit = params.get("limit") ? Number(params.get("limit")) : 10
      let list = highscores
      if (levelId) list = list.filter((h) => h.levelId === levelId)
      list = list.sort((a, b) => b.score - a.score)
      return res.json(list.slice(0, limit))
    } else if (method === "POST") {
      const body = req.body || {}
      const { playerName, score, levelId } = body
      if (
        !playerName ||
        typeof score !== "number" ||
        typeof levelId !== "number"
      )
        return res
          .status(400)
          .json({ error: "playerName, score et levelId sont requis" })

      const levelExists = levels.some((l) => l.id === levelId)
      if (!levelExists)
        return res.status(400).json({ error: "levelId invalide" })

      const newEntry = {
        id: highscores.length
          ? Math.max(...highscores.map((h) => h.id)) + 1
          : 1,
        playerName: String(playerName).slice(0, 30),
        score,
        levelId,
        createdAt: new Date().toISOString(),
      }
      highscores.push(newEntry)

      const perLevel = highscores
        .filter((h) => h.levelId === levelId)
        .sort((a, b) => b.score - a.score)
      const toKeep = perLevel.slice(0, 20).map((h) => h.id)
      highscores = highscores.filter(
        (h) => h.levelId !== levelId || toKeep.includes(h.id)
      )

      return res.status(201).json(newEntry)
    }
  }

  // catalogues
  if (url === "/api/enemies" && method === "GET")
    return res.json(enemiesCatalog)
  if (url === "/api/obstacles" && method === "GET")
    return res.json(obstaclesCatalog)
  if (url === "/api/items" && method === "GET") return res.json(itemsCatalog)

  // fallback
  return res.status(404).json({ error: "Not found" })
}
