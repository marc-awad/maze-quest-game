import React, { useEffect, useState } from "react"
import { Sword, Skull, CheckCircle } from "lucide-react"

interface BattleModalProps {
  enemyName: string
  onBattleEnd: () => void
}

const BattleModal: React.FC<BattleModalProps> = ({
  enemyName,
  onBattleEnd,
}) => {
  const [battleText, setBattleText] = useState("Combat en cours...")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setBattleText(`Vous attaquez ${enemyName}...`)
    }, 500)

    const timer2 = setTimeout(() => {
      setBattleText(`${enemyName} est vaincu ! 🎉`)
      setIsComplete(true)
    }, 1500)

    const timer3 = setTimeout(() => {
      onBattleEnd()
    }, 2500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [enemyName, onBattleEnd])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-yellow-500">
        <div className="text-center">
          <div className="mb-4 flex justify-center gap-4 items-center">
            <Sword className="w-12 h-12 text-yellow-400 animate-pulse" />
            <span className="text-3xl">⚔️</span>
            <Skull className="w-12 h-12 text-red-300 animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Combat !</h2>

          <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
            <p className="text-white text-lg">{battleText}</p>
          </div>

          {isComplete && (
            <div className="flex justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BattleModal
