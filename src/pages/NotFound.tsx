import { useNavigate } from "react-router-dom"
import { Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />

        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page introuvable
        </h2>

        <p className="text-gray-600 mb-6">
          Oups ! Il semblerait que tu te sois perdu dans le labyrinthe... Cette
          page n'existe pas.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <Home size={20} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
