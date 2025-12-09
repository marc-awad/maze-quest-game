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
  const [playerPosition, setPlayerPosition] = useState<{
    row: number
    col: number
  } | null>(null)

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
      // Position du joueur initialisée sur la case départ (S)
      setPlayerPosition({ row: level.start.row, col: level.start.col })
    }
  }, [level])

  // Fonction pour vérifier si une tuile est adjacente à une tuile révélée
  const isAdjacent = (
    row: number,
    col: number,
    revealedTiles: Set<string>
  ): boolean => {
    // Positions relatives : haut, bas, gauche, droite (pas de diagonales)
    const adjacentPositions = [
      [-1, 0], // haut
      [1, 0], // bas
      [0, -1], // gauche
      [0, 1], // droite
    ]

    // Vérifie si au moins une tuile adjacente est révélée
    return adjacentPositions.some(([dRow, dCol]) => {
      const adjacentKey = `${row + dRow}-${col + dCol}`
      return revealedTiles.has(adjacentKey)
    })
  }

  // Fonction pour vérifier si une tuile est adjacente à la position du joueur
  const isAdjacentToPlayer = (row: number, col: number): boolean => {
    if (!playerPosition) return false

    const rowDiff = Math.abs(row - playerPosition.row)
    const colDiff = Math.abs(col - playerPosition.col)

    // Adjacent si différence de 1 sur une seule dimension (pas de diagonale)
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
  }

  const handleTileClick = (row: number, col: number) => {
    if (!level) return

    const key = `${row}-${col}`
    const tileType = level.grid[row][col]

    // Empêcher le clic sur les tuiles déjà révélées (sauf si c'est la position du joueur)
    const isAlreadyRevealed = revealedTiles.has(key)
    const isPlayerTile =
      playerPosition?.row === row && playerPosition?.col === col

    if (isAlreadyRevealed && !isPlayerTile) {
      return
    }

    // Empêcher le clic sur les tuiles non adjacentes AU JOUEUR
    if (!isAdjacentToPlayer(row, col)) {
      console.log(
        `Tuile [${row}, ${col}] non adjacente au joueur - clic ignoré`
      )
      return
    }

    console.log(`Tuile cliquée : [${row}, ${col}] - Type: ${tileType}`)

    // Révéler la tuile
    if (!isAlreadyRevealed) {
      setRevealedTiles((prev) => new Set([...prev, key]))
    }

    // Vérifier le type de tuile avant déplacement
    // Le joueur ne peut pas traverser les murs (W)
    if (tileType === "W") {
      console.log(`Mur détecté à [${row}, ${col}] - déplacement impossible`)
      return
    }

    // Déplacement du joueur lors du clic sur une tuile adjacente de type chemin (C) ou sortie (E)
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
          isAdjacentToPlayer={isAdjacentToPlayer}
          playerPosition={playerPosition}
        />
      </div>
    </div>
  )
}
