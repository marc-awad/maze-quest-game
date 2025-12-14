import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, RotateCw, Home, ChevronRight, TrendingUp } from "lucide-react"
import ScoreBreakdown from "./ScoreBreakdown"
import type { ScoreBreakdown as ScoreBreakdownType } from "../hooks/useAdvancedScore"
import type { Highscore } from "../services/apiService"
import type { SaveStatus } from "../hooks/useHighscore"

interface VictoryModalProps {
  playerName: string
  revealedTilesCount: number
  totalTiles: number
  highscores: Highscore[]
  loadingScores: boolean
  currentScoreId: number | null
  saveStatus: SaveStatus
  saveError: string | null
  currentLevelId: number
  hasNextLevel: boolean
  onResetLevel: () => void
  onRetry: () => void
  scoreBreakdown?: ScoreBreakdownType
  elapsedTime?: number
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  playerName,
  revealedTilesCount,
  totalTiles,
  highscores,
  currentScoreId,
  saveStatus,
  saveError,
  currentLevelId,
  hasNextLevel,
  onResetLevel,
  scoreBreakdown,
  elapsedTime = 0,
}) => {
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const currentScore = scoreBreakdown?.totalScore || 0
  const playerRank = highscores.findIndex((h) => h.id === currentScoreId) + 1

  if (!isOpen) return null // si fermé, ne rien afficher

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={() => setIsOpen(false)} // clique en dehors pour fermer
    >
      <div
        className="bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 rounded-2xl p-1 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // empêche fermeture si clic à l'intérieur
      >
        {/* Croix pour fermer */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-200"
        >
          ×
        </button>

        <div className="bg-gray-900 rounded-xl p-6">
          {/* En-tête victoire */}
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-2">
              🎉 Victoire !
            </h2>
            <p className="text-gray-300">Félicitations {playerName} !</p>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 text-center">
              <p className="text-blue-300 text-sm mb-1">Temps</p>
              <p className="text-white text-2xl font-bold">
                {formatTime(elapsedTime)}
              </p>
            </div>
            <div className="bg-purple-900 bg-opacity-30 rounded-lg p-4 text-center">
              <p className="text-purple-300 text-sm mb-1">Tuiles révélées</p>
              <p className="text-white text-2xl font-bold">
                {revealedTilesCount} / {totalTiles}
              </p>
            </div>
            <div className="bg-green-900 bg-opacity-30 rounded-lg p-4 text-center">
              <p className="text-green-300 text-sm mb-1">Ennemis vaincus</p>
              <p className="text-white text-2xl font-bold">
                {scoreBreakdown?.enemiesDefeated || 0}
              </p>
            </div>
          </div>

          {/* Score principal */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-6 mb-6 text-center">
            <p className="text-white text-sm opacity-90 mb-2">Score final</p>
            <p className="text-white text-5xl font-bold mb-2">
              {currentScore.toLocaleString()}
            </p>
            {playerRank > 0 && (
              <div className="flex items-center justify-center gap-2 text-white text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>#{playerRank} sur le classement</span>
              </div>
            )}
          </div>

          {/* Bouton détails */}
          {scoreBreakdown && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mb-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center justify-between transition-colors"
            >
              <span className="font-semibold">
                {showDetails
                  ? "📊 Masquer les détails"
                  : "📊 Voir le détail du score"}
              </span>
              <ChevronRight
                className={`w-5 h-5 transition-transform ${showDetails ? "rotate-90" : ""}`}
              />
            </button>
          )}

          {/* Détail du score */}
          {showDetails && scoreBreakdown && (
            <div className="mb-6 animate-scale-in">
              <ScoreBreakdown breakdown={scoreBreakdown} showAnimation={true} />
            </div>
          )}

          {/* Statut de sauvegarde */}
          <div className="mb-6">
            {saveStatus === "saving" && (
              <p className="text-blue-400 text-sm text-center">
                💾 Sauvegarde du score...
              </p>
            )}
            {saveStatus === "success" && (
              <p className="text-green-400 text-sm text-center">
                ✅ Score enregistré avec succès !
              </p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-400 text-sm text-center">❌ {saveError}</p>
            )}
          </div>

          {/* Classement */}
          {highscores.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                🏆 Top 5 des meilleurs scores
              </h3>
              <div className="space-y-2">
                {highscores.slice(0, 5).map((score, index) => (
                  <div
                    key={score.id}
                    className={`rounded-lg p-3 flex items-center justify-between ${
                      score.id === currentScoreId
                        ? "bg-yellow-600 bg-opacity-30 border-2 border-yellow-500"
                        : "bg-gray-800 bg-opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {index === 0
                          ? "🥇"
                          : index === 1
                            ? "🥈"
                            : index === 2
                              ? "🥉"
                              : `#${index + 1}`}
                      </span>
                      <div>
                        <p className="text-white font-semibold">
                          {score.playerName}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(score.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-yellow-400 font-bold text-lg">
                      {score.score.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={onResetLevel}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCw size={18} /> Rejouer ce niveau
            </button>
            {hasNextLevel ? (
              <button
                onClick={() => navigate(`/game/${currentLevelId + 1}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                Niveau suivant
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={18} /> Retour à l'accueil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VictoryModal
