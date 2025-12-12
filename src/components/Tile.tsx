import React from "react"
import {
  DoorOpen,
  Trophy,
  Sparkles,
  Square,
  Flame,
  Mountain,
  Droplets,
  KeyRound,
  CircleDot,
  Skull,
  Ghost,
  Pickaxe,
  Waves,
  Package,
  User,
  Sword,
} from "lucide-react"

interface TileData {
  row: number
  col: number
  type: string
  isRevealed: boolean
  isClickable: boolean
  hasPlayer: boolean
}

interface TileProps {
  data: TileData
  onClick: () => void
}

const Tile: React.FC<TileProps> = ({ data, onClick }) => {
  const getTileIcon = () => {
    // Affichage visuel du joueur sur sa position actuelle
    if (data.hasPlayer && data.isRevealed) {
      return <User className="w-6 h-6 text-blue-600" />
    }

    if (!data.isRevealed) {
      return <CircleDot className="w-6 h-6" />
    }

    const type = data.type

    // Cases spéciales
    if (type === "S") return <DoorOpen className="w-6 h-6 text-white" />
    if (type === "E") return <Trophy className="w-6 h-6 text-yellow-600" />
    if (type === "W") return <Square className="w-6 h-6 text-gray-600" />
    if (type === "C") return <Sparkles className="w-6 h-6 text-blue-400" />

    // ===== ARMES (nouveau) =====
    if (type.startsWith("W:")) {
      return <Sword className="w-6 h-6 text-red-600" />
    }

    // Monstres
    if (type.startsWith("M:")) {
      const monsterType = type.split(":")[1]
      if (monsterType === "goblin")
        return <Ghost className="w-6 h-6 text-green-600" />
      if (monsterType === "slime")
        return <Droplets className="w-6 h-6 text-purple-600" />
      if (monsterType === "orc")
        return <Skull className="w-6 h-6 text-red-600" />
    }

    // Obstacles
    if (type.startsWith("O:")) {
      const obstacleType = type.split(":")[1]
      if (obstacleType === "fire")
        return <Flame className="w-6 h-6 text-orange-500" />
      if (obstacleType === "rock")
        return <Mountain className="w-6 h-6 text-stone-600" />
      if (obstacleType === "water")
        return <Waves className="w-6 h-6 text-blue-500" />
    }

    // Clés
    if (type.startsWith("K:")) {
      const keyColor = type.split(":")[1]
      if (keyColor === "red")
        return <KeyRound className="w-6 h-6 text-red-500" />
      if (keyColor === "blue")
        return <KeyRound className="w-6 h-6 text-blue-500" />
    }

    // Portes
    if (type.startsWith("D:")) {
      const doorColor = type.split(":")[1]
      if (doorColor === "red")
        return <DoorOpen className="w-6 h-6 text-red-500" />
      if (doorColor === "blue")
        return <DoorOpen className="w-6 h-6 text-blue-500" />
    }

    // Items
    if (type.startsWith("I:")) {
      const itemId = type.split(":")[1]
      if (itemId === "water_bucket")
        return <Package className="w-6 h-6 text-cyan-500" />
      if (itemId === "pickaxe")
        return <Pickaxe className="w-6 h-6 text-stone-600" />
      if (itemId === "swim_boots")
        return <Waves className="w-6 h-6 text-teal-500" />
    }

    return <CircleDot className="w-6 h-6" />
  }

  const getTileColor = () => {
    if (!data.isRevealed) {
      if (data.isClickable) {
        return "bg-slate-600 hover:bg-slate-500 text-slate-300 ring-2 ring-blue-400 ring-opacity-50"
      }
      return "bg-slate-700 text-slate-500 opacity-50"
    }

    const type = data.type

    if (type === "S") return "bg-green-500"
    if (type === "E") return "bg-yellow-400"
    if (type === "W") return "bg-gray-800"
    if (type === "C") return "bg-blue-50"
    if (type.startsWith("W:")) return "bg-red-100" // Arme
    if (type.startsWith("M:")) return "bg-red-100"
    if (type.startsWith("O:")) return "bg-orange-100"
    if (type.startsWith("K:")) return "bg-purple-100"
    if (type.startsWith("D:")) return "bg-indigo-200"
    if (type.startsWith("I:")) return "bg-cyan-100"

    return "bg-slate-200"
  }

  const getCursor = () => {
    if (data.isRevealed) return "cursor-default"
    if (data.isClickable) return "cursor-pointer"
    return "cursor-not-allowed"
  }

  return (
    <button
      onClick={onClick}
      className={`
        ${getTileColor()}
        ${getCursor()}
        aspect-square
        flex items-center justify-center
        border border-slate-400
        transition-all duration-200
        ${data.isClickable ? "hover:scale-105 active:scale-95" : ""}
        rounded-md
        shadow-sm
      `}
      disabled={data.isRevealed || !data.isClickable}
      aria-label={`Tile at row ${data.row}, column ${data.col}${
        data.isClickable ? " - clickable" : ""
      }`}
    >
      {getTileIcon()}
    </button>
  )
}

export default Tile
