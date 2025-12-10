import { useNavigate } from "react-router-dom"
import {
  Trophy,
  ArrowRight,
  Crown,
  Medal,
  AlertCircle,
  CheckCircle,
  Loader,
  RotateCw,
  Home,
} from "lucide-react"
import type { Highscore } from "../services/apiService"

type SaveStatus = "idle" | "saving" | "success" | "error"

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
}

export default function VictoryModal({
  playerName,
  revealedTilesCount,
  totalTiles,
  highscores,
  loadingScores,
  currentScoreId,
  saveStatus,
  saveError,
  currentLevelId,
  hasNextLevel,
  onResetLevel,
  onRetry,
}: VictoryModalProps) {
  const navigate = useNavigate()

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return null
  }

  const goToNextLevel = () => {
    if (hasNextLevel) {
      navigate(`/game/${currentLevelId + 1}`)
    }
  }

  const goToHome = () => {
    navigate("/")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl transform animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <div className="bg-yellow-100 rounded-full p-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Victoire !</h2>

          <p className="text-gray-600 mb-4">
            {playerName ? `Bravo ${playerName} ! ` : ""}Tu as réussi à atteindre
            la sortie !
          </p>

          {/* FEEDBACK VISUEL DE SAUVEGARDE */}
          {saveStatus === "saving" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <p className="text-blue-700 text-sm font-medium">
                  Enregistrement du score en cours...
                </p>
              </div>
            </div>
          )}

          {saveStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm font-medium">
                  Score enregistré avec succès !
                </p>
              </div>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <p className="text-red-700 text-sm font-medium mb-1">
                    Erreur lors de l'enregistrement
                  </p>
                  <p className="text-red-600 text-xs">{saveError}</p>
                </div>
              </div>
              <button
                onClick={onRetry}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded transition-colors"
              >
                Réessayer l'enregistrement
              </button>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Cases révélées</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {revealedTilesCount}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Score</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {Math.round((revealedTilesCount / totalTiles) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top 10 Highscores
          </h3>

          {loadingScores ? (
            <div className="text-center py-8 text-gray-500">
              <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
              Chargement des scores...
            </div>
          ) : highscores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun score enregistré pour ce niveau
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Rang
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Pseudo
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {highscores.map((score, index) => {
                    const isCurrentPlayer = score.id === currentScoreId
                    return (
                      <tr
                        key={score.id}
                        className={`transition-colors ${
                          isCurrentPlayer
                            ? "bg-yellow-50 border-l-4 border-yellow-500"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getRankIcon(index + 1)}
                            <span
                              className={`font-semibold ${
                                index < 3 ? "text-indigo-600" : "text-gray-600"
                              }`}
                            >
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`${
                              isCurrentPlayer
                                ? "font-bold text-indigo-700"
                                : "text-gray-700"
                            }`}
                          >
                            {score.playerName}
                            {isCurrentPlayer && (
                              <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                                TOI
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-bold ${
                              isCurrentPlayer
                                ? "text-indigo-700"
                                : "text-gray-700"
                            }`}
                          >
                            {score.score}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={goToHome}
            className="flex-1 min-w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Accueil
          </button>

          <button
            onClick={onResetLevel}
            className="flex-1 min-w-[120px] bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCw size={18} />
            Rejouer
          </button>

          {hasNextLevel && (
            <button
              onClick={goToNextLevel}
              className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Niveau suivant
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
