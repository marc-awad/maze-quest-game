import React from "react"
import { Sword, KeyRound, Package } from "lucide-react"
import type { InventoryItem } from "../hooks/useInventory"

interface InventoryProps {
  items: InventoryItem[]
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  const getItemIcon = (item: InventoryItem) => {
    if (item.type === "weapon") {
      return <Sword className="w-5 h-5 text-red-600" />
    }
    if (item.type === "key") {
      const colorClass = item.color === "red" ? "text-red-500" : "text-blue-500"
      return <KeyRound className={`w-5 h-5 ${colorClass}`} />
    }
    return <Package className="w-5 h-5 text-gray-600" />
  }

  if (items.length === 0) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-center">
        <p className="text-white text-sm opacity-70">Inventaire vide</p>
      </div>
    )
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wide">
        🎒 Inventaire
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white bg-opacity-20 rounded-md px-3 py-2 flex items-center gap-2"
            title={item.name}
          >
            {getItemIcon(item)}
            <span className="text-white text-xs font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Inventory
