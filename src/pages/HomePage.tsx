import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usePlayer } from "../utils/PlayerContext"
import { fetchLevels } from "../services/apiService"
import type { LevelSummary } from "../services/apiService"
import { Play, Loader, Sword, Key, Flame, BookOpen } from "lucide-react"

export default function HomePage() {
  const { playerName, setPlayerName } = usePlayer()
  const [inputName, setInputName] = useState(playerName)
  const [error, setError] = useState("")
  const [levels, setLevels] = useState<LevelSummary[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadLevels = async () => {
      try {
        setLoading(true)
        const data = await fetchLevels()
        setLevels(data)
      } catch (err: any) {
        console.error("Erreur chargement niveaux:", err)
      } finally {
        setLoading(false)
      }
    }
    loadLevels()
  }, [])

  const handleStartGame = (levelId: number) => {
    const trimmedName = inputName.trim()

    if (!trimmedName) {
      setError("Le pseudo ne peut pas être vide.")
      return
    }
    if (trimmedName.length > 30) {
      setError("Le pseudo ne peut pas dépasser 30 caractères.")
      return
    }

    setPlayerName(trimmedName)
    navigate(`/game/${levelId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-orange-100 text-orange-700"
      case "extreme":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">MazeQuest</h1>
          <p className="text-white opacity-90 text-lg mb-6">
            Explorez les labyrinthes, récupérez des clés et combattez des
            ennemis pour atteindre la sortie !
          </p>

          {/* Bouton Règles - Centré */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/rules")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <BookOpen size={20} />
              Voir les règles
            </button>
          </div>
        </div>

        {/* Saisie du pseudo */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Choisissez votre pseudo
          </h2>

          <input
            type="text"
            placeholder="Entrez votre pseudo"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value)
              setError("")
            }}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />

          {error && (
            <p className="text-red-500 mt-2 text-sm font-medium">{error}</p>
          )}
        </div>

        {/* Liste des niveaux */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Sélectionnez un niveau
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement des niveaux...</p>
            </div>
          ) : levels.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun niveau disponible
            </div>
          ) : (
            <div className="grid gap-4">
              {levels.map((level) => (
                <div
                  key={level.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-400 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {level.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                            level.difficulty
                          )}`}
                        >
                          {level.difficulty.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{level.description}</p>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-gray-500">
                          {level.rows}×{level.cols}
                        </span>
                        {level.hasCombat && (
                          <span className="flex items-center gap-1 text-red-600">
                            <Sword size={16} />
                            Combats
                          </span>
                        )}
                        {level.hasKeys && (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Key size={16} />
                            Clés
                          </span>
                        )}
                        {level.hasObstacles && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Flame size={16} />
                            Obstacles
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartGame(level.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Play size={18} />
                      Jouer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
