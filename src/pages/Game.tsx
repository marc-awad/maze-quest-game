import { useEffect, useState } from "react"
import { usePlayer } from "../utils/PlayerContext"
import { fetchLevel } from "../services/apiService"
import type { Level } from "../services/apiService"
import Grid from "../components/Grid"
import { RotateCw, Trophy, ArrowRight } from "lucide-react"

type GameStatus = "playing" | "won" | "lost"

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
    }
  }, [level])

  // Détection de victoire à chaque changement de position
  useEffect(() => {
    if (level && playerPosition && gameStatus === "playing") {
      // Vérifier si le joueur a atteint la sortie
      if (
        playerPosition.row === level.end.row &&
        playerPosition.col === level.end.col
      ) {
        console.log("VICTOIRE ! Le joueur a atteint la sortie !")
        setGameStatus("won")
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
    }
  }

  const goToNextLevel = () => {
    // TODO: Implémenter la navigation vers le niveau suivant
    console.log("Passage au niveau suivant...")
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

        {/* Modal de victoire */}
        {gameStatus === "won" && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-scale-in">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-yellow-100 rounded-full p-4">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Victoire !
                </h2>

                <p className="text-gray-600 mb-6">
                  {playerName ? `Bravo ${playerName} ! ` : ""}Tu as réussi à
                  atteindre la sortie !
                </p>

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
