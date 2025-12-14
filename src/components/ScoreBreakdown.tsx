// ScoreBreakdown.tsx - Composant pour afficher le détail du score

import React from "react"
import {
  Grid as GridIcon,
  Heart,
  Skull,
  Clock,
  Footprints,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import type { ScoreBreakdown as ScoreBreakdownType } from "../hooks/useAdvancedScore"

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType
  showAnimation?: boolean
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  breakdown,
  showAnimation = true,
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const scoreItems = [
    {
      icon: <GridIcon className="w-5 h-5 text-blue-400" />,
      label: "Tuiles révélées",
      value: breakdown.tilesRevealed,
      points: breakdown.tilesRevealedPoints,
      isPositive: true,
      description: `${breakdown.tilesRevealed} tuiles × 10 points`,
    },
    {
      icon: <Heart className="w-5 h-5 text-red-400" />,
      label: "HP restants",
      value: breakdown.hpRemaining,
      points: breakdown.hpBonus,
      isPositive: true,
      description: `${breakdown.hpRemaining} HP × 5 points`,
    },
    {
      icon: <Skull className="w-5 h-5 text-purple-400" />,
      label: "Ennemis vaincus",
      value: breakdown.enemiesDefeated,
      points: breakdown.enemyBonus,
      isPositive: true,
      description: `${breakdown.enemiesDefeated} ennemis × 50 points`,
    },
    {
      icon: <Clock className="w-5 h-5 text-yellow-400" />,
      label: "Bonus temps",
      value: formatTime(breakdown.elapsedTime),
      points: breakdown.timeBonus,
      isPositive: true,
      description: `Temps : ${formatTime(breakdown.elapsedTime)}`,
    },
    {
      icon: <Footprints className="w-5 h-5 text-orange-400" />,
      label: "Pénalité déplacements",
      value: breakdown.moveCount,
      points: -breakdown.movePenalty,
      isPositive: false,
      description: `${breakdown.moveCount} déplacements × -2 points`,
    },
  ]

  return (
    <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        📊 Détail du score
      </h3>

      <div className="space-y-3">
        {scoreItems.map((item, index) => (
          <div
            key={index}
            className={`bg-gray-800 bg-opacity-50 rounded-lg p-3 flex items-center justify-between ${
              showAnimation ? "animate-fade-in" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3 flex-1">
              {item.icon}
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-gray-400 text-xs">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span
                className={`font-bold text-lg ${
                  item.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.points > 0 ? "+" : ""}
                {item.points}
              </span>
            </div>
          </div>
        ))}

        {/* Ligne de séparation */}
        <div className="border-t-2 border-gray-700 my-4"></div>

        {/* Score total */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium opacity-90">
                Score total
              </p>
              <p className="text-white text-xs opacity-75">Votre performance</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white text-3xl font-bold">
              {breakdown.totalScore.toLocaleString()}
            </p>
            <p className="text-white text-xs opacity-75">points</p>
          </div>
        </div>
      </div>

      {/* Formule explicative */}
      <div className="mt-4 bg-blue-900 bg-opacity-30 rounded-lg p-3">
        <p className="text-blue-300 text-xs font-mono">
          Score = (Tuiles × 10) + (HP × 5) + (Ennemis × 50) + Temps -
          (Déplacements × 2)
        </p>
      </div>
    </div>
  )
}

export default ScoreBreakdown
