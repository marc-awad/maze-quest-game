// useAdvancedScore.ts - Hook pour le calcul de score avancé

import { useState, useCallback } from "react"
import type { Level } from "../services/apiService"

export interface ScoreBreakdown {
  tilesRevealed: number
  tilesRevealedPoints: number
  hpRemaining: number
  hpBonus: number
  enemiesDefeated: number
  enemyBonus: number
  timeBonus: number
  elapsedTime: number
  moveCount: number
  movePenalty: number
  totalScore: number
}

/**
 * Hook pour gérer le calcul de score avancé
 * Prend en compte : tuiles révélées, HP restants, ennemis vaincus, temps, déplacements
 */
export function useAdvancedScore() {
  const [trapsActivated, setTrapsActivated] = useState(0)

  /**
   * Calculer le score final avec tous les critères
   */
  const calculateAdvancedScore = useCallback(
    (
      level: Level | null,
      revealedTilesCount: number,
      playerHP: number,
      maxHP: number,
      enemiesDefeated: number,
      elapsedTime: number,
      moveCount: number
    ): ScoreBreakdown => {
      console.log(maxHP)
      if (!level) {
        return {
          tilesRevealed: 0,
          tilesRevealedPoints: 0,
          hpRemaining: 0,
          hpBonus: 0,
          enemiesDefeated: 0,
          enemyBonus: 0,
          timeBonus: 0,
          elapsedTime: 0,
          moveCount: 0,
          movePenalty: 0,
          totalScore: 0,
        }
      }

      // 1. Points pour tuiles révélées (10 points par tuile)
      const tilesRevealedPoints = revealedTilesCount * 10

      // 2. Bonus HP restants (5 points par HP)
      const hpBonus = playerHP * 5

      // 3. Bonus ennemis vaincus (50 points par ennemi)
      const enemyBonus = enemiesDefeated * 50

      // 4. Bonus temps (max 1000 points, diminue avec le temps)
      const timeBonus = Math.max(0, 1000 - elapsedTime)

      // 5. Pénalité déplacements (2 points par déplacement)
      const movePenalty = moveCount * 2

      // 6. Pénalité pièges activés (50 points par piège)
      const trapPenalty = trapsActivated * 50

      // Calcul total
      const totalScore = Math.max(
        0,
        tilesRevealedPoints +
          hpBonus +
          enemyBonus +
          timeBonus -
          movePenalty -
          trapPenalty
      )

      return {
        tilesRevealed: revealedTilesCount,
        tilesRevealedPoints,
        hpRemaining: playerHP,
        hpBonus,
        enemiesDefeated,
        enemyBonus,
        timeBonus,
        elapsedTime,
        moveCount,
        movePenalty,
        totalScore,
      }
    },
    [trapsActivated]
  )

  /**
   * Incrémenter le compteur de pièges activés
   */
  const activateTrap = useCallback(() => {
    setTrapsActivated((prev) => prev + 1)
  }, [])

  /**
   * Réinitialiser les métriques
   */
  const resetMetrics = useCallback(() => {
    setTrapsActivated(0)
  }, [])

  return {
    calculateAdvancedScore,
    activateTrap,
    resetMetrics,
    trapsActivated,
  }
}
