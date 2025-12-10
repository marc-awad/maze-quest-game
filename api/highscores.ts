import { VercelRequest, VercelResponse } from "@vercel/node"
import { levels } from "../data/level"

let highscores: any[] = []

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const params = new URLSearchParams(req.url?.split("?")[1])
    const levelId = params.get("levelId") ? Number(params.get("levelId")) : null
    const limit = params.get("limit") ? Number(params.get("limit")) : 10
    let list = highscores
    if (levelId) list = list.filter((h) => h.levelId === levelId)
    list = list.sort((a, b) => b.score - a.score)
    return res.json(list.slice(0, limit))
  }

  if (req.method === "POST") {
    const body = req.body || {}
    const { playerName, score, levelId } = body
    if (!playerName || typeof score !== "number" || typeof levelId !== "number")
      return res
        .status(400)
        .json({ error: "playerName, score et levelId sont requis" })

    const levelExists = levels.some((l) => l.id === levelId)
    if (!levelExists) return res.status(400).json({ error: "levelId invalide" })

    const newEntry = {
      id: highscores.length ? Math.max(...highscores.map((h) => h.id)) + 1 : 1,
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

  res.status(405).json({ error: "Method not allowed" })
}
