import { useState, useEffect, useCallback } from "react"
import { fetchLevel } from "../services/apiService"
import type { Level } from "../services/apiService"

/**
 * Hook personnalisé pour gérer le chargement et la réinitialisation du niveau
 */
export function useGameLevel(levelId: string | undefined) {
  const [level, setLevel] = useState<Level | null>(null)
  const [originalLevel, setOriginalLevel] = useState<Level | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Charger le niveau depuis l'API
  useEffect(() => {
    if (!levelId) return

    const loadLevel = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchLevel(Number(levelId))
        setOriginalLevel(data)
        setLevel(data)
      } catch (err: any) {
        setError(err.message || "Erreur de chargement du niveau")
      } finally {
        setLoading(false)
      }
    }

    loadLevel()
  }, [levelId])

  // Fonction pour réinitialiser le niveau
  const resetLevel = useCallback(() => {
    if (!originalLevel) return
    setLevel({ ...originalLevel })
  }, [originalLevel])

  return {
    level,
    originalLevel,
    loading,
    error,
    resetLevel,
  }
}
