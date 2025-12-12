import { useState, useCallback, useEffect, useRef } from "react"
import { postHighscore, getHighscoresByLevel } from "../services/apiService"
import type { Highscore, Level } from "../services/apiService"
import type { GameStatus } from "./useGameState"

export type SaveStatus = "idle" | "saving" | "success" | "error"

/**
 * Hook pour gérer l'enregistrement et l'affichage des highscores
 */
export function useHighscore(
  level: Level | null,
  playerName: string,
  gameStatus: GameStatus,
  calculateScore: () => number
) {
  const [highscores, setHighscores] = useState<Highscore[]>([])
  const [currentScoreId, setCurrentScoreId] = useState<number | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  // Éviter les doubles enregistrements
  const victoryHandledRef = useRef(false)

  /**
   * Enregistrer le score du joueur
   */
  const saveHighscore = useCallback(
    async (retryCount = 0) => {
      if (!level || !playerName) return

      try {
        setSaveStatus("saving")
        setSaveError(null)

        const finalScore = calculateScore()

        // Enregistrer le nouveau score
        const newScore = await postHighscore({
          playerName: playerName || "Anonyme",
          score: finalScore,
          levelId: level.id,
        })

        setCurrentScoreId(newScore.id)

        // Récupérer les highscores mis à jour
        const scores = await getHighscoresByLevel(level.id, 10)
        setHighscores(scores)

        setSaveStatus("success")
        console.log("✅ Score enregistré avec succès")
      } catch (error: any) {
        console.error("❌ Erreur enregistrement score:", error)

        // Réessayer une fois en cas d'échec
        if (retryCount < 1) {
          console.log("🔄 Tentative de réenregistrement...")
          setTimeout(() => saveHighscore(retryCount + 1), 1500)
          return
        }

        setSaveStatus("error")
        setSaveError(error.message || "Impossible de contacter le serveur")
      }
    },
    [level, playerName, calculateScore]
  )

  /**
   * Gérer automatiquement la sauvegarde à la victoire
   */
  useEffect(() => {
    if (gameStatus === "won" && !victoryHandledRef.current) {
      victoryHandledRef.current = true
      saveHighscore()
    }
  }, [gameStatus, saveHighscore])

  /**
   * Réinitialiser l'état des highscores
   */
  const resetHighscore = useCallback(() => {
    setCurrentScoreId(null)
    setSaveStatus("idle")
    setSaveError(null)
    victoryHandledRef.current = false
  }, [])

  return {
    highscores,
    currentScoreId,
    saveStatus,
    saveError,
    saveHighscore,
    resetHighscore,
  }
}
