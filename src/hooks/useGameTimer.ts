// useGameTimer.ts - Hook pour gérer le chronomètre du jeu

import { useState, useEffect, useCallback, useRef } from "react"
import type { Level } from "../services/apiService"
import type { GameStatus } from "./useGameState"

/**
 * Hook pour gérer le chronomètre de jeu
 * Le timer démarre automatiquement au chargement du niveau
 * et s'arrête à la fin de la partie (victoire ou défaite)
 */
export function useGameTimer(level: Level | null, gameStatus: GameStatus) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Démarrer le timer quand le niveau est chargé
  useEffect(() => {
    if (level && gameStatus === "playing") {
      setIsRunning(true)
      setElapsedTime(0)
    }
  }, [level, gameStatus])

  // Arrêter le timer quand la partie est terminée
  useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      setIsRunning(false)
    }
  }, [gameStatus])

  // Gérer le compte à rebours
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  /**
   * Formater le temps en mm:ss
   */
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  /**
   * Calculer le bonus de temps
   * Plus le joueur est rapide, plus le bonus est élevé
   * Formule : max(0, 1000 - elapsedTime)
   */
  const calculateTimeBonus = useCallback(
    (seconds: number = elapsedTime): number => {
      return Math.max(0, 1000 - seconds)
    },
    [elapsedTime]
  )

  /**
   * Réinitialiser le timer
   */
  const resetTimer = useCallback(() => {
    setElapsedTime(0)
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  /**
   * Mettre en pause le timer
   */
  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  /**
   * Reprendre le timer
   */
  const resumeTimer = useCallback(() => {
    if (gameStatus === "playing") {
      setIsRunning(true)
    }
  }, [gameStatus])

  return {
    elapsedTime,
    isRunning,
    formatTime,
    calculateTimeBonus,
    resetTimer,
    pauseTimer,
    resumeTimer,
    formattedTime: formatTime(elapsedTime),
  }
}
