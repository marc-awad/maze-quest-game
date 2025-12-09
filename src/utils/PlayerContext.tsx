import { createContext, useState, useContext } from "react"
import type { ReactNode } from "react"

interface PlayerContextType {
  playerName: string
  setPlayerName: (name: string) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerName] = useState("")

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error("usePlayer must be used within PlayerProvider")
  return context
}
