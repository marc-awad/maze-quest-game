// types.ts - Types partagés pour le système de combat

export interface Enemy {
  type: string
  name: string
  hp: number
  attack: number
  description: string
  icon: string
}

export interface Weapon {
  id: string
  name: string
  damage: number
  description?: string
  icon?: string
}

export interface CombatState {
  playerHP: number
  playerMaxHP: number
  enemyHP: number
  enemyMaxHP: number
  enemyAttack: number
  playerDamage: number
  turn: number
  isPlayerTurn: boolean
  battleLog: string[]
}

export interface BattleResult {
  victory: boolean
  finalPlayerHP: number
  damageDealt: number
  damageTaken: number
}
