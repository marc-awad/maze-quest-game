// usePlayerHP.ts - Hook pour gérer les HP du joueur

import { useState, useCallback, useEffect } from "react"
import type { Level } from "../services/apiService"

const DEFAULT_PLAYER_HP = 100

/**
 * Hook pour gérer les points de vie du joueur
 */
export function usePlayerHP(level: Level | null) {
  const [playerHP, setPlayerHP] = useState(DEFAULT_PLAYER_HP)
  const [maxHP] = useState(DEFAULT_PLAYER_HP)

  // Réinitialiser les HP quand le niveau change
  useEffect(() => {
    if (level) {
      setPlayerHP(DEFAULT_PLAYER_HP)
    }
  }, [level])

  /**
   * Réduire les HP du joueur
   */
  const takeDamage = useCallback((damage: number) => {
    setPlayerHP((prev) => Math.max(0, prev - damage))
  }, [])

  /**
   * Restaurer les HP du joueur
   */
  const heal = useCallback(
    (amount: number) => {
      setPlayerHP((prev) => Math.min(maxHP, prev + amount))
    },
    [maxHP]
  )

  /**
   * Définir les HP directement (après combat)
   */
  const setHP = useCallback(
    (newHP: number) => {
      setPlayerHP(Math.max(0, Math.min(maxHP, newHP)))
    },
    [maxHP]
  )

  /**
   * Vérifier si le joueur est vivant
   */
  const isAlive = useCallback(() => {
    return playerHP > 0
  }, [playerHP])

  /**
   * Réinitialiser les HP
   */
  const resetHP = useCallback(() => {
    setPlayerHP(DEFAULT_PLAYER_HP)
  }, [])

  /**
   * Obtenir le pourcentage de HP restants
   */
  const getHPPercentage = useCallback(() => {
    return (playerHP / maxHP) * 100
  }, [playerHP, maxHP])

  return {
    playerHP,
    maxHP,
    takeDamage,
    heal,
    setHP,
    isAlive,
    resetHP,
    getHPPercentage,
  }
}
