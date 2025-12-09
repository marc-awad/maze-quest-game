// URL de base configurable via .env
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

// Interface pour un niveau
export interface Level {
  id: number
  name: string
  description: string
  rows: number
  cols: number
  difficulty: "easy" | "medium" | "hard" | "extreme"
  hasCombat: boolean
  hasKeys: boolean
  hasObstacles: boolean
  start: { row: number; col: number }
  end: { row: number; col: number }
  grid: string[][]
  enemies: any[]
  obstacles: any[]
  items: any[]
}

// Fonction pour récupérer un niveau par son ID
export async function fetchLevel(levelId: number): Promise<Level> {
  try {
    const response = await fetch(`${BASE_URL}/levels/${levelId}`)
    if (!response.ok) {
      throw new Error(
        `Erreur ${response.status} : Impossible de récupérer le niveau`
      )
    }
    const data: Level = await response.json()
    return data
  } catch (error: any) {
    console.error("fetchLevel error:", error)
    throw new Error(
      error.message || "Erreur inconnue lors de la récupération du niveau"
    )
  }
}
