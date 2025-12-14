// useAdvancedBattle.ts - Hook pour le système de combat avancé

import { useState, useCallback } from "react"
import type { Enemy, CombatState } from "./types"
import {
  initializeCombat,
  executeCombatTurn,
  checkCombatEnd,
} from "./combatLogic"

interface BattleState {
  enemy: Enemy
  position: { row: number; col: number }
  combatState: CombatState
}

/**
 * Hook pour gérer le système de combat avancé avec HP et stats
 */
export function useAdvancedBattle() {
  const [defeatedEnemies, setDefeatedEnemies] = useState<Set<string>>(new Set())
  const [currentBattle, setCurrentBattle] = useState<BattleState | null>(null)

  /**
   * Vérifier si un ennemi a déjà été vaincu
   */
  const isEnemyDefeated = useCallback(
    (row: number, col: number): boolean => {
      const key = `${row}-${col}`
      return defeatedEnemies.has(key)
    },
    [defeatedEnemies]
  )

  /**
   * Démarrer un combat avec stats complètes
   */
  const startBattle = useCallback(
    (
      enemy: Enemy,
      row: number,
      col: number,
      playerMaxHP: number,
      currentPlayerHP: number,
      weaponDamage: number
    ): boolean => {
      const enemyKey = `${row}-${col}`

      // Ne pas démarrer si l'ennemi est déjà vaincu
      if (defeatedEnemies.has(enemyKey)) {
        return false
      }

      const combatState = initializeCombat(
        enemy,
        playerMaxHP,
        currentPlayerHP,
        weaponDamage
      )

      setCurrentBattle({
        enemy,
        position: { row, col },
        combatState,
      })

      return true
    },
    [defeatedEnemies]
  )

  /**
   * Exécuter le prochain tour de combat
   */
  const executeTurn = useCallback(() => {
    if (!currentBattle) return null

    const newCombatState = executeCombatTurn(currentBattle.combatState)
    const result = checkCombatEnd(newCombatState)

    setCurrentBattle({
      ...currentBattle,
      combatState: newCombatState,
    })

    return result
  }, [currentBattle])

  /**
   * Terminer le combat et marquer l'ennemi comme vaincu
   */
  const endBattle = useCallback((): {
    position: { row: number; col: number }
    finalPlayerHP: number
  } | null => {
    if (!currentBattle) return null

    const enemyKey = `${currentBattle.position.row}-${currentBattle.position.col}`
    setDefeatedEnemies((prev) => new Set([...prev, enemyKey]))

    const battlePosition = currentBattle.position
    const finalPlayerHP = currentBattle.combatState.playerHP

    setCurrentBattle(null)

    return { position: battlePosition, finalPlayerHP }
  }, [currentBattle])

  /**
   * Abandonner le combat (défaite)
   */
  const forfeitBattle = useCallback(() => {
    if (!currentBattle) return null

    const finalPlayerHP = currentBattle.combatState.playerHP
    setCurrentBattle(null)

    return finalPlayerHP
  }, [currentBattle])

  /**
   * Réinitialiser tous les combats
   */
  const resetBattles = useCallback(() => {
    setDefeatedEnemies(new Set())
    setCurrentBattle(null)
  }, [])

  return {
    currentBattle,
    defeatedEnemies,
    isEnemyDefeated,
    startBattle,
    executeTurn,
    endBattle,
    forfeitBattle,
    resetBattles,
  }
}
