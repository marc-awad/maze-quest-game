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

// Interface pour un highscore
export interface Highscore {
  id: number
  playerName: string
  score: number
  levelId: number
  createdAt: string
}

// Interface pour créer un nouveau highscore
export interface CreateHighscorePayload {
  playerName: string
  score: number
  levelId: number
}

/* ===============================================
   NIVEAUX
=============================================== */

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

/* ===============================================
   HIGHSCORES
=============================================== */

/**
 * Récupère la liste des highscores
 * @param levelId - ID du niveau (optionnel, si null récupère tous les scores)
 * @param limit - Nombre maximum de scores à récupérer (par défaut 10)
 * @returns Liste des highscores triés par score décroissant
 */
export async function getHighscores(
  levelId?: number | null,
  limit: number = 10
): Promise<Highscore[]> {
  try {
    // Construction de l'URL avec les paramètres
    const params = new URLSearchParams()
    if (levelId) {
      params.append("levelId", levelId.toString())
    }
    params.append("limit", limit.toString())

    const response = await fetch(`${BASE_URL}/highscores?${params.toString()}`)

    if (!response.ok) {
      throw new Error(
        `Erreur ${response.status} : Impossible de récupérer les highscores`
      )
    }

    const data: Highscore[] = await response.json()
    return data
  } catch (error: any) {
    console.error("getHighscores error:", error)
    throw new Error(
      error.message || "Erreur inconnue lors de la récupération des highscores"
    )
  }
}

/**
 * Enregistre un nouveau highscore
 * @param payload - Objet contenant playerName, score et levelId
 * @returns Le highscore créé avec son ID
 */
export async function postHighscore(
  payload: CreateHighscorePayload
): Promise<Highscore> {
  try {
    // Validation des données avant envoi
    if (!payload.playerName || payload.playerName.trim().length === 0) {
      throw new Error("Le nom du joueur est requis")
    }

    if (typeof payload.score !== "number" || payload.score < 0) {
      throw new Error("Le score doit être un nombre positif")
    }

    if (typeof payload.levelId !== "number" || payload.levelId < 1) {
      throw new Error("L'ID du niveau doit être un nombre valide")
    }

    // Limitation de la longueur du nom (30 caractères max côté serveur)
    const sanitizedPayload = {
      ...payload,
      playerName: payload.playerName.trim().slice(0, 30),
    }

    const response = await fetch(`${BASE_URL}/highscores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedPayload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error ||
          `Erreur ${response.status} : Impossible d'enregistrer le highscore`
      )
    }

    const data: Highscore = await response.json()
    return data
  } catch (error: any) {
    console.error("postHighscore error:", error)
    throw new Error(
      error.message || "Erreur inconnue lors de l'enregistrement du highscore"
    )
  }
}

/**
 * Récupère les highscores d'un niveau spécifique
 * (fonction utilitaire pour simplifier l'usage courant)
 * @param levelId - ID du niveau
 * @param limit - Nombre maximum de scores (par défaut 10)
 */
export async function getHighscoresByLevel(
  levelId: number,
  limit: number = 10
): Promise<Highscore[]> {
  return getHighscores(levelId, limit)
}

/**
 * Récupère tous les highscores (tous niveaux confondus)
 * @param limit - Nombre maximum de scores (par défaut 10)
 */
export async function getAllHighscores(
  limit: number = 10
): Promise<Highscore[]> {
  return getHighscores(null, limit)
}
