import React from "react"
import Tile from "./Tile"

interface TileData {
  row: number
  col: number
  type: string
  isRevealed: boolean
}

interface GridProps {
  gridData: string[][]
  rows: number
  cols: number
  revealedTiles: Set<string> // ← État externe
  onTileClick: (row: number, col: number) => void
}

const Grid: React.FC<GridProps> = ({
  gridData,
  rows,
  cols,
  revealedTiles, // ← Reçu en prop
  onTileClick,
}) => {
  const handleTileClick = (row: number, col: number) => {
    const key = `${row}-${col}`

    // Ne déclenche l'action que si la tuile n'est pas révélée
    if (!revealedTiles.has(key)) {
      onTileClick(row, col)
    }
  }

  const getTileData = (row: number, col: number): TileData => {
    const key = `${row}-${col}`
    return {
      row,
      col,
      type: gridData[row][col],
      isRevealed: revealedTiles.has(key),
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="bg-slate-800 p-4 rounded-lg shadow-xl">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => (
              <Tile
                key={`${row}-${col}`}
                data={getTileData(row, col)}
                onClick={() => handleTileClick(row, col)}
              />
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-sm text-gray-600">
          Cases révélées : {revealedTiles.size} / {rows * cols}
        </p>
      </div>
    </div>
  )
}

export default Grid
