import { useState, useCallback, useEffect } from "react"
import type { Level } from "../services/apiService"

export type GameStatus = "playing" | "won" | "lost"

/**
 * Hook pour gérer l'état global du jeu
 * Gère les tuiles révélées, la position du joueur, le statut et le score
 */
export function useGameState(level: Level | null) {
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set())
  const [playerPosition, setPlayerPosition] = useState<{
    row: number
    col: number
  } | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [moveCount, setMoveCount] = useState(0)

  // Initialiser l'état quand le niveau change
  useEffect(() => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
      setPlayerPosition({ row: level.start.row, col: level.start.col })
      setGameStatus("playing")
      setMoveCount(0)
    }
  }, [level])

  // Vérifier si le joueur a atteint la sortie
  useEffect(() => {
    if (level && playerPosition && gameStatus === "playing") {
      if (
        playerPosition.row === level.end.row &&
        playerPosition.col === level.end.col
      ) {
        console.log("🎉 VICTOIRE ! Le joueur a atteint la sortie !")
        setGameStatus("won")
      }
    }
  }, [playerPosition, level, gameStatus])

  // Révéler une tuile
  const revealTile = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`
    setRevealedTiles((prev) => new Set([...prev, key]))
  }, [])

  // Déplacer le joueur
  const movePlayer = useCallback((row: number, col: number) => {
    setPlayerPosition({ row, col })
    setMoveCount((prev) => prev + 1)
  }, [])

  // Calculer le score basé sur les déplacements
  const calculateScore = useCallback((): number => {
    if (!level) return 0
    const maxPossibleScore = level.rows * level.cols * 10
    const penaltyPerMove = 5
    return Math.max(0, maxPossibleScore - moveCount * penaltyPerMove)
  }, [level, moveCount])

  // Réinitialiser l'état du jeu
  const resetGameState = useCallback(() => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
      setPlayerPosition({ row: level.start.row, col: level.start.col })
      setGameStatus("playing")
      setMoveCount(0)
    }
  }, [level])

  return {
    revealedTiles,
    playerPosition,
    gameStatus,
    moveCount,
    revealTile,
    movePlayer,
    setGameStatus,
    calculateScore,
    resetGameState,
  }
}
