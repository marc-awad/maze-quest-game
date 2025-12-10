import React from "react"
import Tile from "./Tile"

interface TileData {
  row: number
  col: number
  type: string
  isRevealed: boolean
  isClickable: boolean
  hasPlayer: boolean
}

interface GridProps {
  gridData: string[][]
  rows: number
  cols: number
  revealedTiles: Set<string>
  onTileClick: (row: number, col: number) => void
  isAdjacent: (row: number, col: number, revealedTiles: Set<string>) => boolean
  isAdjacentToPlayer: (row: number, col: number) => boolean
  playerPosition: { row: number; col: number } | null
  gameStatus: string
}

const Grid: React.FC<GridProps> = ({
  gridData,
  rows,
  cols,
  revealedTiles,
  onTileClick,
  isAdjacentToPlayer,
  playerPosition,
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
    const isRevealed = revealedTiles.has(key)
    // Une tuile est cliquable si elle est adjacente AU JOUEUR et non révélée
    const isClickable = !isRevealed && isAdjacentToPlayer(row, col)
    const hasPlayer =
      playerPosition !== null &&
      playerPosition.row === row &&
      playerPosition.col === col

    return {
      row,
      col,
      type: gridData[row][col],
      isRevealed,
      isClickable,
      hasPlayer,
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
