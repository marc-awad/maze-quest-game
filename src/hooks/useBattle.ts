import { useState, useCallback } from "react"

interface BattleState {
  enemyName: string
  position: { row: number; col: number }
}

/**
 * Mapping des types de monstres vers leurs noms affichés
 */
const ENEMY_NAMES: Record<string, string> = {
  goblin: "Gobelin",
  slime: "Slime",
  orc: "Orc",
}

/**
 * Hook pour gérer la logique des combats
 * Gère les ennemis vaincus et l'état du combat actuel
 */
export function useBattle() {
  const [defeatedEnemies, setDefeatedEnemies] = useState<Set<string>>(new Set())
  const [currentBattle, setCurrentBattle] = useState<BattleState | null>(null)

  /**
   * Obtenir le nom d'affichage d'un ennemi à partir de son type
   */
  const getEnemyName = useCallback((monsterType: string): string => {
    return ENEMY_NAMES[monsterType] || "Monstre"
  }, [])

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
   * Démarrer un combat avec un ennemi
   */
  const startBattle = useCallback(
    (monsterType: string, row: number, col: number) => {
      const enemyKey = `${row}-${col}`

      // Ne pas démarrer de combat si l'ennemi est déjà vaincu
      if (defeatedEnemies.has(enemyKey)) {
        return false
      }

      setCurrentBattle({
        enemyName: getEnemyName(monsterType),
        position: { row, col },
      })
      return true
    },
    [defeatedEnemies, getEnemyName]
  )

  /**
   * Terminer le combat actuel et marquer l'ennemi comme vaincu
   */
  const endBattle = useCallback(() => {
    if (!currentBattle) return null

    const enemyKey = `${currentBattle.position.row}-${currentBattle.position.col}`
    setDefeatedEnemies((prev) => new Set([...prev, enemyKey]))

    const battlePosition = currentBattle.position
    setCurrentBattle(null)

    return battlePosition
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
    endBattle,
    resetBattles,
  }
}
