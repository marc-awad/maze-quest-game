import { VercelRequest, VercelResponse } from "@vercel/node"
import { enemiesCatalog } from "../data/catalog"

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.json(enemiesCatalog)
  }
  res.status(405).json({ error: "Method not allowed" })
}
