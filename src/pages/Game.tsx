import { useEffect, useState } from "react"
import { fetchLevel } from "../services/apiService"
import type { Level } from "../services/apiService"

export default function Game() {
  const [level, setLevel] = useState<Level | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLevel = async () => {
      try {
        setLoading(true)
        const data = await fetchLevel(1)
        setLevel(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLevel()
  }, [])

  if (loading) return <p>Chargement du niveau...</p>
  if (error) return <p>Erreur : {error}</p>

  return (
    <div>
      <h1>{level?.name}</h1>
      <p>{level?.description}</p>
      <pre>{JSON.stringify(level?.grid, null, 2)}</pre>
    </div>
  )
}
