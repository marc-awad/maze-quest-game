import { VercelRequest, VercelResponse } from "@vercel/node"
import { levels } from "../../data/level"

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { id } = req.query
    const level = levels.find((l) => l.id === Number(id))
    if (!level) return res.status(404).json({ error: "Level not found" })
    return res.json(level)
  }
  res.status(405).json({ error: "Method not allowed" })
}
