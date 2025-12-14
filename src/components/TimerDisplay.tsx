// TimerDisplay.tsx - Composant pour afficher le chronomètre

import React from "react"
import { Clock, Play, Pause } from "lucide-react"

interface TimerDisplayProps {
  formattedTime: string
  isRunning: boolean
  size?: "small" | "medium" | "large"
  showStatus?: boolean
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  formattedTime,
  isRunning,
  size = "medium",
  showStatus = true,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "px-3 py-1",
          text: "text-lg",
          icon: "w-4 h-4",
        }
      case "large":
        return {
          container: "px-6 py-3",
          text: "text-3xl",
          icon: "w-8 h-8",
        }
      default:
        return {
          container: "px-4 py-2",
          text: "text-xl",
          icon: "w-5 h-5",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div
      className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-lg ${sizeClasses.container} flex items-center gap-3`}
    >
      <div className="relative">
        <Clock className={`${sizeClasses.icon} text-blue-400`} />
        {showStatus && (
          <div className="absolute -top-1 -right-1">
            {isRunning ? (
              <Play className="w-3 h-3 text-green-400 animate-pulse" />
            ) : (
              <Pause className="w-3 h-3 text-gray-400" />
            )}
          </div>
        )}
      </div>

      <div>
        <p className="text-white text-xs opacity-70">Temps</p>
        <p className={`text-white font-bold font-mono ${sizeClasses.text}`}>
          {formattedTime}
        </p>
      </div>
    </div>
  )
}

export default TimerDisplay
