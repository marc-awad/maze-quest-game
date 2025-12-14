// AdvancedBattleModal.tsx - Modal de combat avec HP et tours

import React, { useEffect, useState } from "react"
import { Sword, Shield, Skull, Trophy } from "lucide-react"
import HealthBar from "./HealthBar"
import type { CombatState, BattleResult } from "../hooks/types"

interface AdvancedBattleModalProps {
  enemyName: string
  enemyIcon: string
  combatState: CombatState
  onAttack: () => void
  onBattleEnd: (result: BattleResult) => void
  battleResult: BattleResult | null
}

const AdvancedBattleModal: React.FC<AdvancedBattleModalProps> = ({
  enemyName,
  enemyIcon,
  combatState,
  onAttack,
  onBattleEnd,
  battleResult,
}) => {
  const [autoPlay, setAutoPlay] = useState(false)

  // Combat automatique si activé
  useEffect(() => {
    if (autoPlay && !battleResult && combatState.isPlayerTurn) {
      const timer = setTimeout(() => {
        onAttack()
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, battleResult, combatState.isPlayerTurn, onAttack])

  // Fermer automatiquement après victoire/défaite
  useEffect(() => {
    if (battleResult) {
      const timer = setTimeout(() => {
        onBattleEnd(battleResult)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [battleResult, onBattleEnd])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl border-4 border-yellow-500">
        {/* Titre */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Sword className="w-8 h-8 text-yellow-400" />
            Combat !
            <Skull className="w-8 h-8 text-red-400" />
          </h2>
          <p className="text-gray-300">Tour {combatState.turn}</p>
        </div>

        {/* Barres de vie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Joueur */}
          <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Vous</h3>
            </div>
            <HealthBar
              currentHP={combatState.playerHP}
              maxHP={combatState.playerMaxHP}
              label=""
              size="large"
            />
            <p className="text-sm text-gray-300 mt-2">
              ⚔️ Dégâts: {combatState.playerDamage}
            </p>
          </div>

          {/* Ennemi */}
          <div className="bg-red-900 bg-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{enemyIcon}</span>
              <h3 className="text-xl font-bold text-white">{enemyName}</h3>
            </div>
            <HealthBar
              currentHP={combatState.enemyHP}
              maxHP={combatState.enemyMaxHP}
              label=""
              size="large"
            />
            <p className="text-sm text-gray-300 mt-2">
              💥 Attaque: {combatState.enemyAttack}
            </p>
          </div>
        </div>

        {/* Log de combat */}
        <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6 h-48 overflow-y-auto">
          {combatState.battleLog.map((log, idx) => (
            <p
              key={idx}
              className="text-gray-200 text-sm mb-1 animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {log}
            </p>
          ))}
        </div>

        {/* Résultat final */}
        {battleResult && (
          <div
            className={`text-center p-4 rounded-lg mb-4 ${
              battleResult.victory
                ? "bg-green-500 bg-opacity-20 border-2 border-green-500"
                : "bg-red-500 bg-opacity-20 border-2 border-red-500"
            }`}
          >
            {battleResult.victory ? (
              <>
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Victoire ! 🎉
                </h3>
                <p className="text-gray-200">
                  HP restants: {battleResult.finalPlayerHP}
                </p>
              </>
            ) : (
              <>
                <Skull className="w-12 h-12 text-red-400 mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Défaite...
                </h3>
                <p className="text-gray-200">Vous avez été vaincu...</p>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        {!battleResult && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={onAttack}
              disabled={!combatState.isPlayerTurn}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${
                combatState.isPlayerTurn
                  ? "bg-red-600 hover:bg-red-700 active:scale-95"
                  : "bg-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              <Sword className="w-5 h-5" />
              {combatState.isPlayerTurn ? "Attaquer" : "Tour ennemi..."}
            </button>

            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
                autoPlay
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {autoPlay ? "⏸️ Pause" : "▶️ Auto"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancedBattleModal
