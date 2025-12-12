import { useState } from "react"

export interface InventoryItem {
  id: string
  type: "weapon" | "key" | "item"
  name: string
  color?: string // Pour les clés
}

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([])

  const addItem = (item: InventoryItem) => {
    setInventory((prev) => {
      // Évite les doublons
      if (prev.some((i) => i.id === item.id)) return prev
      return [...prev, item]
    })
  }

  const hasItem = (itemId: string): boolean => {
    return inventory.some((item) => item.id === itemId)
  }

  const hasWeapon = (): boolean => {
    return inventory.some((item) => item.type === "weapon")
  }

  const hasKey = (color: string): boolean => {
    return inventory.some((item) => item.type === "key" && item.color === color)
  }

  const removeItem = (itemId: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== itemId))
  }

  const reset = () => {
    setInventory([])
  }

  return {
    inventory,
    addItem,
    hasItem,
    hasWeapon,
    hasKey,
    removeItem,
    reset,
  }
}
