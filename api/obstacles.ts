import { VercelRequest, VercelResponse } from "@vercel/node"
import { obstaclesCatalog } from "../data/catalog"

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.json(obstaclesCatalog)
  }
  res.status(405).json({ error: "Method not allowed" })
}
