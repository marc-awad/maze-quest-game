import { useEffect, useState } from "react"
import {
  fetchLevel,
  postHighscore,
  getHighscoresByLevel,
} from "../services/apiService"
import type { Level, Highscore } from "../services/apiService"
import Grid from "../components/Grid"
import {
  RotateCw,
  Trophy,
  ArrowRight,
  Crown,
  Medal,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react"
import { usePlayer } from "../utils/PlayerContext"

type GameStatus = "playing" | "won" | "lost"
type SaveStatus = "idle" | "saving" | "success" | "error"

export default function Game() {
  const { playerName } = usePlayer()
  const [level, setLevel] = useState<Level | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set())
  const [playerPosition, setPlayerPosition] = useState<{
    row: number
    col: number
  } | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [highscores, setHighscores] = useState<Highscore[]>([])
  const [loadingScores, setLoadingScores] = useState(false)
  const [currentScoreId, setCurrentScoreId] = useState<number | null>(null)

  // Nouveaux états pour le feedback
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const loadLevel = async () => {
      try {
        setLoading(true)
        const data = await fetchLevel(1)
        setLevel(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLevel()
  }, [])

  useEffect(() => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
      setPlayerPosition({ row: level.start.row, col: level.start.col })
      setGameStatus("playing")
      setSaveStatus("idle")
      setSaveError(null)
    }
  }, [level])

  const loadHighscores = async () => {
    if (!level) return

    try {
      setLoadingScores(true)
      const scores = await getHighscoresByLevel(level.id, 10)
      setHighscores(scores)
    } catch (error) {
      console.error("Erreur chargement highscores:", error)
    } finally {
      setLoadingScores(false)
    }
  }

  const handleVictory = async (retryCount = 0) => {
    if (!level) return

    try {
      setSaveStatus("saving")
      setSaveError(null)

      const newScore = await postHighscore({
        playerName: playerName || "Anonyme",
        score: revealedTiles.size,
        levelId: level.id,
      })

      setCurrentScoreId(newScore.id)
      await loadHighscores()
      setSaveStatus("success")
    } catch (error: any) {
      console.error("Erreur enregistrement score:", error)

      // Retry une fois en cas d'échec réseau
      if (retryCount < 1) {
        console.log("Tentative de réenregistrement...")
        setTimeout(() => handleVictory(retryCount + 1), 1500)
        return
      }

      setSaveStatus("error")
      setSaveError(error.message || "Impossible de contacter le serveur")
    }
  }

  useEffect(() => {
    if (level && playerPosition && gameStatus === "playing") {
      if (
        playerPosition.row === level.end.row &&
        playerPosition.col === level.end.col
      ) {
        console.log("VICTOIRE ! Le joueur a atteint la sortie !")
        setGameStatus("won")
        handleVictory()
      }
    }
  }, [playerPosition, level, gameStatus])

  const isAdjacent = (
    row: number,
    col: number,
    revealedTiles: Set<string>
  ): boolean => {
    const adjacentPositions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    return adjacentPositions.some(([dRow, dCol]) => {
      const adjacentKey = `${row + dRow}-${col + dCol}`
      return revealedTiles.has(adjacentKey)
    })
  }

  const isAdjacentToPlayer = (row: number, col: number): boolean => {
    if (!playerPosition) return false

    const rowDiff = Math.abs(row - playerPosition.row)
    const colDiff = Math.abs(col - playerPosition.col)

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }

  const handleTileClick = (row: number, col: number) => {
    if (!level || gameStatus !== "playing") return

    const key = `${row}-${col}`
    const tileType = level.grid[row][col]

    const isAlreadyRevealed = revealedTiles.has(key)
    const isPlayerTile =
      playerPosition?.row === row && playerPosition?.col === col

    if (isAlreadyRevealed && !isPlayerTile) {
      return
    }

    if (!isAdjacentToPlayer(row, col)) {
      console.log(
        `Tuile [${row}, ${col}] non adjacente au joueur - clic ignoré`
      )
      return
    }

    console.log(`Tuile cliquée : [${row}, ${col}] - Type: ${tileType}`)

    if (!isAlreadyRevealed) {
      setRevealedTiles((prev) => new Set([...prev, key]))
    }

    if (tileType === "W") {
      console.log(`Mur détecté à [${row}, ${col}] - déplacement impossible`)
      return
    }

    if (tileType === "C" || tileType === "E" || tileType === "S") {
      setPlayerPosition({ row, col })
      console.log(`Joueur déplacé à [${row}, ${col}]`)
    }
  }

  const resetLevel = () => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
      setPlayerPosition({ row: level.start.row, col: level.start.col })
      setGameStatus("playing")
      setCurrentScoreId(null)
      setSaveStatus("idle")
      setSaveError(null)
    }
  }

  const goToNextLevel = () => {
    console.log("Passage au niveau suivant...")
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <p className="text-white text-2xl">Chargement du niveau...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!level) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">{level.name}</h1>
          <p className="text-white opacity-80 mb-1">{level.description}</p>
          <div className="flex justify-center gap-4 text-sm text-white opacity-70">
            <span>Difficulté : {level.difficulty}</span>
            <span>•</span>
            <span>
              {level.rows}×{level.cols}
            </span>
            <span>•</span>
            <span className="font-semibold">
              Statut: {gameStatus === "won" ? "🎉 GAGNÉ" : "En cours"}
            </span>
          </div>

          <button
            onClick={resetLevel}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RotateCw size={18} />
            Réinitialiser
          </button>
        </div>

        <Grid
          gridData={level.grid}
          rows={level.rows}
          cols={level.cols}
          revealedTiles={revealedTiles}
          onTileClick={handleTileClick}
          isAdjacent={isAdjacent}
          isAdjacentToPlayer={isAdjacentToPlayer}
          playerPosition={playerPosition}
          gameStatus={gameStatus}
        />

        {gameStatus === "won" && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl transform animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <div className="bg-yellow-100 rounded-full p-4">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Victoire !
                </h2>

                <p className="text-gray-600 mb-4">
                  {playerName ? `Bravo ${playerName} ! ` : ""}Tu as réussi à
                  atteindre la sortie !
                </p>

                {/* FEEDBACK VISUEL DE SAUVEGARDE */}
                {saveStatus === "saving" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 animate-pulse">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                      <p className="text-blue-700 text-sm font-medium">
                        💾 Enregistrement du score en cours...
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
                          ❌ Erreur lors de l'enregistrement
                        </p>
                        <p className="text-red-600 text-xs">{saveError}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleVictory(0)}
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
                        {revealedTiles.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Score</p>
                      <p className="text-2xl font-bold text-indigo-600">
                        {Math.round(
                          (revealedTiles.size / (level.rows * level.cols)) * 100
                        )}
                        %
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
                                      index < 3
                                        ? "text-indigo-600"
                                        : "text-gray-600"
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

              <div className="flex gap-3">
                <button
                  onClick={resetLevel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw size={18} />
                  Rejouer
                </button>

                <button
                  onClick={goToNextLevel}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Niveau suivant
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
