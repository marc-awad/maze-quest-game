// HealthBar.tsx - Composant pour afficher la barre de vie

import React from "react"
import { Heart } from "lucide-react"

interface HealthBarProps {
  currentHP: number
  maxHP: number
  label?: string
  showNumbers?: boolean
  size?: "small" | "medium" | "large"
}

const HealthBar: React.FC<HealthBarProps> = ({
  currentHP,
  maxHP,
  label = "HP",
  showNumbers = true,
  size = "medium",
}) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100))

  // Couleur selon le pourcentage de HP
  const getColor = () => {
    if (percentage > 60) return "bg-green-500"
    if (percentage > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-2"
      case "large":
        return "h-6"
      default:
        return "h-4"
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-white">{label}</span>
          </div>
          {showNumbers && (
            <span className="text-sm font-mono text-white">
              {currentHP} / {maxHP}
            </span>
          )}
        </div>
      )}

      <div className="relative w-full bg-gray-700 rounded-full overflow-hidden border-2 border-gray-600">
        <div
          className={`${getSizeClasses()} ${getColor()} transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animation de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default HealthBar
