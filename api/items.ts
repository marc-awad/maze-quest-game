import { VercelRequest, VercelResponse } from "@vercel/node"
import { itemsCatalog } from "../data/catalog"

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    return res.json(itemsCatalog)
  }
  res.status(405).json({ error: "Method not allowed" })
}
