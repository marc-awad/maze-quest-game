import { useCallback } from "react"
import type { Level } from "../services/apiService"
import type { GameStatus } from "./useGameState"

/**
 * Hook pour gérer la logique de déplacement du joueur
 * Valide les mouvements et vérifie l'adjacence
 */
export function usePlayerMovement(
  level: Level | null,
  playerPosition: { row: number; col: number } | null,
  gameStatus: GameStatus
) {
  /**
   * Vérifier si une tuile est adjacente à la position du joueur
   * (seulement orthogonalement, pas en diagonal)
   */
  const isAdjacentToPlayer = useCallback(
    (row: number, col: number): boolean => {
      if (!playerPosition) return false

      const rowDiff = Math.abs(row - playerPosition.row)
      const colDiff = Math.abs(col - playerPosition.col)

      return (
        (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
      )
    },
    [playerPosition]
  )

  /**
   * Vérifier si une tuile est adjacente à n'importe quelle tuile révélée
   * Utilisé pour l'affichage visuel
   */
  const isAdjacentToRevealed = useCallback(
    (row: number, col: number, revealedTiles: Set<string>): boolean => {
      const adjacentPositions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]
      return adjacentPositions.some(([dRow, dCol]) => {
        const adjacentKey = `${row + dRow}-${col + dCol}`
        return revealedTiles.has(adjacentKey)
      })
    },
    []
  )

  /**
   * Vérifier si le joueur peut interagir (pas en combat, jeu en cours)
   */
  const canInteract = useCallback(
    (currentBattle: any): boolean => {
      return gameStatus === "playing" && !currentBattle
    },
    [gameStatus]
  )

  /**
   * Vérifier si une position est valide dans la grille
   */
  const isValidPosition = useCallback(
    (row: number, col: number): boolean => {
      if (!level) return false
      return row >= 0 && row < level.rows && col >= 0 && col < level.cols
    },
    [level]
  )

  /**
   * Vérifier si une tuile est la position actuelle du joueur
   */
  const isPlayerTile = useCallback(
    (row: number, col: number): boolean => {
      return playerPosition?.row === row && playerPosition?.col === col
    },
    [playerPosition]
  )

  return {
    isAdjacentToPlayer,
    isAdjacentToRevealed,
    canInteract,
    isValidPosition,
    isPlayerTile,
  }
}
