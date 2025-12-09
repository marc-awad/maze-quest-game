import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface HomePageProps {
  onSetPlayerName: (name: string) => void
}

export default function HomePage({ onSetPlayerName }: HomePageProps) {
  const [playerName, setPlayerName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleStartGame = () => {
    const trimmedName = playerName.trim()

    if (!trimmedName) {
      setError("Le pseudo ne peut pas être vide.")
      return
    }
    if (trimmedName.length > 30) {
      setError("Le pseudo ne peut pas dépasser 30 caractères.")
      return
    }

    // Stocker le pseudo dans le state/context
    onSetPlayerName(trimmedName)

    // Rediriger vers le jeu
    navigate("/game")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">MazeQuest</h1>
      <p className="mb-6 text-center max-w-md">
        Bienvenue dans MazeQuest ! Explorez les labyrinthes, récupérez des clés
        et combattez des ennemis pour atteindre la sortie.
      </p>

      <input
        type="text"
        placeholder="Entrez votre pseudo"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="border border-gray-400 rounded px-3 py-2 w-64 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleStartGame}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Jouer
      </button>
    </div>
  )
}
