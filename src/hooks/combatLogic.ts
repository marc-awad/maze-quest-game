// combatLogic.ts - Logique de combat isolée

import type { Enemy, CombatState, BattleResult } from "./types"

/**
 * Initialise l'état d'un combat
 */
export function initializeCombat(
  enemy: Enemy,
  playerMaxHP: number,
  currentPlayerHP: number,
  weaponDamage: number
): CombatState {
  return {
    playerHP: currentPlayerHP,
    playerMaxHP: playerMaxHP,
    enemyHP: enemy.hp,
    enemyMaxHP: enemy.hp,
    enemyAttack: enemy.attack,
    playerDamage: weaponDamage,
    turn: 1,
    isPlayerTurn: true,
    battleLog: [
      `Combat contre ${enemy.name} !`,
      `${enemy.name} : ${enemy.hp} HP`,
    ],
  }
}

/**
 * Exécute un tour de combat
 */
export function executeCombatTurn(state: CombatState): CombatState {
  const newLog = [...state.battleLog]
  let newPlayerHP = state.playerHP
  let newEnemyHP = state.enemyHP

  if (state.isPlayerTurn) {
    // Tour du joueur : attaque
    newEnemyHP = Math.max(0, state.enemyHP - state.playerDamage)
    newLog.push(`⚔️ Vous infligez ${state.playerDamage} dégâts !`)

    if (newEnemyHP > 0) {
      newLog.push(`Ennemi : ${newEnemyHP}/${state.enemyMaxHP} HP`)
    }
  } else {
    // Tour de l'ennemi : contre-attaque
    newPlayerHP = Math.max(0, state.playerHP - state.enemyAttack)
    newLog.push(`💥 L'ennemi vous inflige ${state.enemyAttack} dégâts !`)
    newLog.push(`Vous : ${newPlayerHP}/${state.playerMaxHP} HP`)
  }

  return {
    ...state,
    playerHP: newPlayerHP,
    enemyHP: newEnemyHP,
    turn: state.turn + (state.isPlayerTurn ? 0 : 1),
    isPlayerTurn: !state.isPlayerTurn,
    battleLog: newLog,
  }
}

/**
 * Vérifie si le combat est terminé et retourne le résultat
 */
export function checkCombatEnd(state: CombatState): BattleResult | null {
  if (state.enemyHP <= 0) {
    return {
      victory: true,
      finalPlayerHP: state.playerHP,
      damageDealt: state.enemyMaxHP,
      damageTaken: state.playerMaxHP - state.playerHP,
    }
  }

  if (state.playerHP <= 0) {
    return {
      victory: false,
      finalPlayerHP: 0,
      damageDealt: state.enemyMaxHP - state.enemyHP,
      damageTaken: state.playerMaxHP,
    }
  }

  return null
}

/**
 * Calcule le combat complet automatiquement (mode rapide)
 */
export function simulateFullCombat(
  enemy: Enemy,
  playerMaxHP: number,
  weaponDamage: number
): BattleResult {
  let playerHP = playerMaxHP
  let enemyHP = enemy.hp
  let totalDamageTaken = 0

  while (playerHP > 0 && enemyHP > 0) {
    // Tour du joueur
    enemyHP -= weaponDamage
    if (enemyHP <= 0) break

    // Tour de l'ennemi
    playerHP -= enemy.attack
    totalDamageTaken += enemy.attack
  }

  return {
    victory: enemyHP <= 0,
    finalPlayerHP: Math.max(0, playerHP),
    damageDealt: enemy.hp - Math.max(0, enemyHP),
    damageTaken: totalDamageTaken,
  }
}
