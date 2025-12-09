import { useEffect, useState } from "react"
import { fetchLevel } from "../services/apiService"
import type { Level } from "../services/apiService"
import Grid from "../components/Grid"
import { RotateCw } from "lucide-react"

export default function Game() {
  const [level, setLevel] = useState<Level | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set())

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
    }
  }, [level])

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

  const handleTileClick = (row: number, col: number) => {
    if (!level) return

    const key = `${row}-${col}`

    if (revealedTiles.has(key)) {
      return
    }

    if (!isAdjacent(row, col, revealedTiles)) {
      console.log(`Tuile [${row}, ${col}] non adjacente - clic ignoré`)
      return
    }

    const tileType = level.grid[row][col]
    console.log(`Tuile cliquée : [${row}, ${col}] - Type: ${tileType}`)

    setRevealedTiles((prev) => new Set([...prev, key]))
  }

  const resetLevel = () => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
    }
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
        />
      </div>
    </div>
  )
}
