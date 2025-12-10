import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import VictoryModal from "../components/VictoryModal"
import {
  fetchLevel,
  postHighscore,
  getHighscoresByLevel,
} from "../services/apiService"
import type { Level, Highscore } from "../services/apiService"
import Grid from "../components/Grid"
import {
  RotateCw,
  Home,
  Crown,
  Medal,

} from "lucide-react"
import { usePlayer } from "../utils/PlayerContext"

type GameStatus = "playing" | "won" | "lost"
type SaveStatus = "idle" | "saving" | "success" | "error"

export default function Game() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
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
      if (!levelId) {
        navigate("/")
        return
      }

      try {
        setLoading(true)
        const data = await fetchLevel(Number(levelId))
        setLevel(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLevel()
  }, [levelId, navigate])

  useEffect(() => {
    if (!playerName) {
      navigate("/")
    }
  }, [playerName, navigate])

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
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <Home size={18} />
            Retour à l'accueil
          </button>
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

        {gameStatus === "won" && level && (
          <VictoryModal
            playerName={playerName}
            revealedTilesCount={revealedTiles.size}
            totalTiles={level.rows * level.cols}
            highscores={highscores}
            loadingScores={loadingScores}
            currentScoreId={currentScoreId}
            saveStatus={saveStatus}
            saveError={saveError}
            currentLevelId={level.id}
            hasNextLevel={level.id < 4}
            onResetLevel={resetLevel}
            onRetry={() => handleVictory(0)}
          />
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
