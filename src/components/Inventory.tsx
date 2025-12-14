// Inventory.tsx - Version améliorée avec sections visuelles

import React, { useState } from "react"
import { Sword, KeyRound, Package, Info } from "lucide-react"
import type { InventoryItem } from "../hooks/useInventory"

interface InventoryProps {
  items: InventoryItem[]
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Séparer les objets par catégorie
  const weapons = items.filter((i) => i.type === "weapon")
  const keys = items.filter((i) => i.type === "key")
  const generalItems = items.filter((i) => i.type === "item")

  const getItemIcon = (item: InventoryItem) => {
    if (item.type === "weapon") {
      return <Sword className="w-5 h-5 text-red-600" />
    }
    if (item.type === "key") {
      const colorClass = item.color === "red" ? "text-red-500" : "text-blue-500"
      return <KeyRound className={`w-5 h-5 ${colorClass}`} />
    }
    return <Package className="w-5 h-5 text-cyan-500" />
  }

  const getItemDescription = (item: InventoryItem): string => {
    const descriptions: Record<string, string> = {
      sword: "Inflige des dégâts aux ennemis",
      key_red: "Ouvre les portes rouges",
      key_blue: "Ouvre les portes bleues",
      water_bucket: "Éteint les flammes",
      pickaxe: "Casse les rochers",
      swim_boots: "Traverse l'eau profonde",
    }
    return descriptions[item.id] || "Objet utile"
  }

  const renderCategory = (
    title: string,
    icon: React.ReactNode,
    categoryItems: InventoryItem[],
    emptyMessage: string
  ) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h4 className="text-white font-bold text-sm uppercase tracking-wide">
          {title}
        </h4>
        <span className="text-white text-xs opacity-60">
          ({categoryItems.length})
        </span>
      </div>

      {categoryItems.length === 0 ? (
        <p className="text-white text-xs opacity-50 italic ml-6">
          {emptyMessage}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 ml-6">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer transition-all">
                {getItemIcon(item)}
                <span className="text-white text-xs font-medium">
                  {item.name}
                </span>
              </div>

              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 animate-fade-in">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-gray-700 whitespace-nowrap">
                    <div className="flex items-center gap-1 mb-1">
                      <Info className="w-3 h-3" />
                      <span className="font-bold">{item.name}</span>
                    </div>
                    <p className="text-gray-300">{getItemDescription(item)}</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1 border-r border-b border-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (items.length === 0) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
        <Package className="w-8 h-8 text-white opacity-50 mx-auto mb-2" />
        <p className="text-white text-sm opacity-70">Inventaire vide</p>
        <p className="text-white text-xs opacity-50 mt-1">
          Explorez pour trouver des objets !
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-white" />
        <h3 className="text-white font-bold text-lg uppercase tracking-wide">
          🎒 Inventaire
        </h3>
        <span className="text-white text-sm opacity-70">
          ({items.length} objets)
        </span>
      </div>

      <div className="space-y-3">
        {renderCategory(
          "Armes",
          <Sword className="w-4 h-4 text-red-500" />,
          weapons,
          "Aucune arme"
        )}

        {renderCategory(
          "Clés",
          <KeyRound className="w-4 h-4 text-yellow-500" />,
          keys,
          "Aucune clé"
        )}

        {renderCategory(
          "Objets",
          <Package className="w-4 h-4 text-cyan-500" />,
          generalItems,
          "Aucun objet"
        )}
      </div>
    </div>
  )
}

export default Inventory
