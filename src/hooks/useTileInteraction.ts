import { useState, useCallback } from "react"
import type { InventoryItem } from "./useInventory"

/**
 * Hook pour gérer les interactions avec les différents types de tuiles
 * Gère les messages de blocage et la collecte d'objets
 */
export function useTileInteraction() {
  const [blockMessage, setBlockMessage] = useState<string | null>(null)

  /**
   * Afficher un message de blocage temporaire (2.5 secondes)
   */
  const showBlockMessage = useCallback((message: string) => {
    setBlockMessage(message)
    setTimeout(() => setBlockMessage(null), 2500)
  }, [])

  /**
   * Vérifier et gérer l'interaction avec une porte
   * @returns true si le passage est autorisé, false sinon
   */
  const handleDoorInteraction = useCallback(
    (doorColor: string, hasKey: (color: string) => boolean): boolean => {
      if (!hasKey(doorColor)) {
        showBlockMessage(
          `🚪 Porte ${doorColor} verrouillée ! Trouvez la clé ${doorColor}.`
        )
        return false
      }
      console.log(`✅ Porte ${doorColor} déverrouillée avec la clé`)
      return true
    },
    [showBlockMessage]
  )

  /**
   * Vérifier et gérer l'interaction avec un monstre
   * @returns true si le combat peut démarrer, false si bloqué
   */
  const handleMonsterInteraction = useCallback(
    (
      monsterType: string,
      row: number,
      col: number,
      hasWeapon: () => boolean,
      isEnemyDefeated: (row: number, col: number) => boolean
    ): "defeated" | "battle" | "blocked" => {
      console.log(monsterType)
      // Monstre déjà vaincu
      if (isEnemyDefeated(row, col)) {
        console.log("Monstre déjà vaincu, passage libre")
        return "defeated"
      }

      // Pas d'arme
      if (!hasWeapon()) {
        showBlockMessage(`⚔️ Monstre bloque le passage ! Trouvez une arme.`)
        return "blocked"
      }

      // Combat possible
      return "battle"
    },
    [showBlockMessage]
  )

  /**
   * Créer un objet InventoryItem à partir d'une tuile clé
   */
  const createKeyItem = useCallback((keyColor: string): InventoryItem => {
    return {
      id: `key_${keyColor}`,
      type: "key",
      name: `Clé ${keyColor}`,
      color: keyColor,
    }
  }, [])

  /**
   * Créer un objet InventoryItem à partir d'une tuile arme
   */
  const createWeaponItem = useCallback((weaponId?: string): InventoryItem => {
    return {
      id: weaponId || "sword",
      type: "weapon",
      name: "Épée",
    }
  }, [])

  /**
   * Créer un objet InventoryItem à partir d'une tuile item
   */
  const createGeneralItem = useCallback((itemId: string): InventoryItem => {
    const itemNames: Record<string, string> = {
      water_bucket: "Seau d'eau",
      pickaxe: "Pioche",
      swim_boots: "Bottes amphibies",
    }
    return {
      id: itemId,
      type: "item",
      name: itemNames[itemId] || "Objet",
    }
  }, [])

  /**
   * Réinitialiser les messages
   */
  const resetMessages = useCallback(() => {
    setBlockMessage(null)
  }, [])

  return {
    blockMessage,
    showBlockMessage,
    handleDoorInteraction,
    handleMonsterInteraction,
    createKeyItem,
    createWeaponItem,
    createGeneralItem,
    resetMessages,
  }
}
