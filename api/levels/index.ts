import { VercelRequest, VercelResponse } from "@vercel/node"
import { levels } from "../../data/level"

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
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
  res.status(405).json({ error: "Method not allowed" })
}
