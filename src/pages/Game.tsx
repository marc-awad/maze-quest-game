import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import VictoryModal from "../components/VictoryModal"
import BattleModal from "../components/BattleModal"
import Inventory from "../components/Inventory"
import {
  fetchLevel,
  postHighscore,
  getHighscoresByLevel,
} from "../services/apiService"
import type { Level, Highscore } from "../services/apiService"
import Grid from "../components/Grid"
import { RotateCw, Home, AlertTriangle } from "lucide-react"
import { usePlayer } from "../utils/PlayerContext"
import { useInventory } from "../hooks/useInventory"
import type { InventoryItem } from "../hooks/useInventory"

type GameStatus = "playing" | "won" | "lost"
type SaveStatus = "idle" | "saving" | "success" | "error"

export default function Game() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { playerName } = usePlayer()
  const {
    inventory,
    addItem,
    hasWeapon,
    hasKey,
    reset: resetInventory,
  } = useInventory()

  const [level, setLevel] = useState<Level | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(new Set())
  const [playerPosition, setPlayerPosition] = useState<{
    row: number
    col: number
  } | null>(null)
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing")
  const [highscores, setHighscores] = useState<Highscore[]>([])
  const [loadingScores, setLoadingScores] = useState(false)
  const [currentScoreId, setCurrentScoreId] = useState<number | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
  const [moveCount, setMoveCount] = useState<number>(0)

  // États RPG
  const [defeatedEnemies, setDefeatedEnemies] = useState<Set<string>>(new Set())
  const [currentBattle, setCurrentBattle] = useState<{
    enemyName: string
    position: { row: number; col: number }
  } | null>(null)
  const [blockMessage, setBlockMessage] = useState<string | null>(null)

  // Refs pour éviter les boucles infinies
  const victoryHandledRef = useRef(false)
  const resetInventoryRef = useRef(resetInventory)

  // Mettre à jour la ref quand resetInventory change
  useEffect(() => {
    resetInventoryRef.current = resetInventory
  }, [resetInventory])

  useEffect(() => {
    const loadLevel = async () => {
      if (!levelId) {
        navigate("/")
        return
      }

      try {
        setLoading(true)
        const data = await fetchLevel(Number(levelId))
        setLevel(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadLevel()
  }, [levelId, navigate])

  useEffect(() => {
    if (!playerName) {
      navigate("/")
    }
  }, [playerName, navigate])

  // FIX: Utiliser la ref au lieu de la dépendance directe
  useEffect(() => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
      setPlayerPosition({ row: level.start.row, col: level.start.col })
      setGameStatus("playing")
      setSaveStatus("idle")
      setSaveError(null)
      setMoveCount(0)
      setDefeatedEnemies(new Set())
      setCurrentBattle(null)
      setBlockMessage(null)
      resetInventoryRef.current() // ← Utiliser la ref
      victoryHandledRef.current = false
    }
  }, [level]) // ← Retirer resetInventory des dépendances

  const loadHighscores = useCallback(async () => {
    if (!level) return

    try {
      setLoadingScores(true)
      const scores = await getHighscoresByLevel(level.id, 10)
      setHighscores(scores)
    } catch (error) {
      console.error("Erreur chargement highscores:", error)
    } finally {
      setLoadingScores(false)
    }
  }, [level])

  const calculateScore = useCallback((): number => {
    if (!level) return 0
    const maxPossibleScore = level.rows * level.cols * 10
    const penaltyPerMove = 5
    const calculatedScore = maxPossibleScore - moveCount * penaltyPerMove
    return Math.max(0, calculatedScore)
  }, [level, moveCount])

  const handleVictory = useCallback(
    async (retryCount = 0) => {
      if (!level || !playerName) return

      try {
        setSaveStatus("saving")
        setSaveError(null)

        const maxPossibleScore = level.rows * level.cols * 10
        const penaltyPerMove = 5
        const finalScore = Math.max(
          0,
          maxPossibleScore - moveCount * penaltyPerMove
        )

        const newScore = await postHighscore({
          playerName: playerName || "Anonyme",
          score: finalScore,
          levelId: level.id,
        })

        setCurrentScoreId(newScore.id)

        const scores = await getHighscoresByLevel(level.id, 10)
        setHighscores(scores)

        setSaveStatus("success")
      } catch (error: any) {
        console.error("Erreur enregistrement score:", error)

        if (retryCount < 1) {
          console.log("Tentative de réenregistrement...")
          setTimeout(() => handleVictory(retryCount + 1), 1500)
          return
        }

        setSaveStatus("error")
        setSaveError(error.message || "Impossible de contacter le serveur")
      }
    },
    [level, playerName, moveCount]
  )

  useEffect(() => {
    if (level && playerPosition && gameStatus === "playing") {
      if (
        playerPosition.row === level.end.row &&
        playerPosition.col === level.end.col
      ) {
        console.log("VICTOIRE ! Le joueur a atteint la sortie !")
        setGameStatus("won")
      }
    }
  }, [playerPosition, level, gameStatus])

  useEffect(() => {
    if (gameStatus === "won" && !victoryHandledRef.current) {
      victoryHandledRef.current = true
      handleVictory()
    }
  }, [gameStatus, handleVictory])

  const isAdjacentToPlayer = useCallback(
    (row: number, col: number): boolean => {
      if (!playerPosition) return false

      const rowDiff = Math.abs(row - playerPosition.row)
      const colDiff = Math.abs(col - playerPosition.col)

      return (
        (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
      )
    },
    [playerPosition]
  )

  const getEnemyName = (monsterType: string): string => {
    const names: Record<string, string> = {
      goblin: "Gobelin",
      slime: "Slime",
      orc: "Orc",
    }
    return names[monsterType] || "Monstre"
  }

  const handleTileClick = useCallback(
    (row: number, col: number) => {
      if (!level || gameStatus !== "playing" || currentBattle) return

      const key = `${row}-${col}`
      const tileType = level.grid[row][col]

      const isPlayerTile =
        playerPosition?.row === row && playerPosition?.col === col

      if (isPlayerTile) return

      if (!isAdjacentToPlayer(row, col)) {
        console.log(
          `Tuile [${row}, ${col}] non adjacente au joueur - clic ignoré`
        )
        return
      }

      console.log(`Tuile cliquée : [${row}, ${col}] - Type: ${tileType}`)

      // Révéler la case si elle n'est pas déjà révélée
      const isAlreadyRevealed = revealedTiles.has(key)
      if (!isAlreadyRevealed) {
        setRevealedTiles((prev) => new Set([...prev, key]))
      }

      if (tileType.startsWith("D:")) {
        const doorColor = tileType.split(":")[1]
        if (!hasKey(doorColor)) {
          setBlockMessage(
            `🚪 Porte ${doorColor} verrouillée ! Trouvez la clé ${doorColor}.`
          )
          setTimeout(() => setBlockMessage(null), 2500)
          return
        }
        console.log(`✅ Porte ${doorColor} déverrouillée avec la clé`)
      }

      if (tileType.startsWith("M:")) {
        const monsterType = tileType.split(":")[1]
        const enemyKey = `${row}-${col}`

        if (defeatedEnemies.has(enemyKey)) {
          console.log("Monstre déjà vaincu, passage libre")
        } else {
          if (!hasWeapon()) {
            setBlockMessage(`⚔️ Monstre bloque le passage ! Trouvez une arme.`)
            setTimeout(() => setBlockMessage(null), 2500)
            return
          }

          setCurrentBattle({
            enemyName: getEnemyName(monsterType),
            position: { row, col },
          })
          return
        }
      }

      if (tileType === "W") {
        console.log(`Mur détecté à [${row}, ${col}] - déplacement impossible`)
        return
      }

      setMoveCount((prev) => prev + 1)
      setPlayerPosition({ row, col })
      console.log(`Joueur déplacé à [${row}, ${col}]`)

      if (tileType.startsWith("K:")) {
        const keyColor = tileType.split(":")[1]
        const keyItem: InventoryItem = {
          id: `key_${keyColor}`,
          type: "key",
          name: `Clé ${keyColor}`,
          color: keyColor,
        }
        addItem(keyItem)
        console.log(`🗝️ Clé ${keyColor} ramassée`)
      }

      if (tileType.startsWith("W:")) {
        const weaponId = tileType.split(":")[1] || "sword"
        const weaponItem: InventoryItem = {
          id: weaponId,
          type: "weapon",
          name: "Épée",
        }
        addItem(weaponItem)
        console.log(`⚔️ Arme ramassée`)
      }

      if (tileType.startsWith("I:")) {
        const itemId = tileType.split(":")[1]
        const itemNames: Record<string, string> = {
          water_bucket: "Seau d'eau",
          pickaxe: "Pioche",
          swim_boots: "Bottes amphibies",
        }
        const itemObj: InventoryItem = {
          id: itemId,
          type: "item",
          name: itemNames[itemId] || "Objet",
        }
        addItem(itemObj)
        console.log(`📦 Item ${itemObj.name} ramassé`)
      }
    },
    [
      level,
      gameStatus,
      currentBattle,
      playerPosition,
      isAdjacentToPlayer,
      hasKey,
      hasWeapon,
      defeatedEnemies,
      revealedTiles,
      addItem,
    ]
  )

  const handleBattleEnd = useCallback(() => {
    if (!currentBattle) return

    const enemyKey = `${currentBattle.position.row}-${currentBattle.position.col}`
    setDefeatedEnemies((prev) => new Set([...prev, enemyKey]))

    const key = `${currentBattle.position.row}-${currentBattle.position.col}`
    if (!revealedTiles.has(key)) {
      setRevealedTiles((prev) => new Set([...prev, key]))
    }

    setMoveCount((prev) => prev + 1)
    setPlayerPosition(currentBattle.position)

    console.log(
      `✅ Combat terminé, joueur déplacé à [${currentBattle.position.row}, ${currentBattle.position.col}]`
    )
    setCurrentBattle(null)
  }, [currentBattle, revealedTiles])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        !level ||
        !playerPosition ||
        gameStatus !== "playing" ||
        currentBattle
      )
        return

      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return

      let dx = 0
      let dy = 0

      switch (event.key) {
        case "ArrowUp":
          dy = -1
          event.preventDefault()
          break
        case "ArrowDown":
          dy = 1
          event.preventDefault()
          break
        case "ArrowLeft":
          dx = -1
          event.preventDefault()
          break
        case "ArrowRight":
          dx = 1
          event.preventDefault()
          break
        default:
          return
      }

      const newRow = playerPosition.row + dy
      const newCol = playerPosition.col + dx

      if (
        newRow < 0 ||
        newRow >= level.rows ||
        newCol < 0 ||
        newCol >= level.cols
      ) {
        console.log(`Position hors limites : [${newRow}, ${newCol}]`)
        return
      }

      handleTileClick(newRow, newCol)
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [level, playerPosition, gameStatus, currentBattle, handleTileClick])

  const resetLevel = useCallback(() => {
    if (level) {
      const startKey = `${level.start.row}-${level.start.col}`
      setRevealedTiles(new Set([startKey]))
      setPlayerPosition({ row: level.start.row, col: level.start.col })
      setGameStatus("playing")
      setCurrentScoreId(null)
      setSaveStatus("idle")
      setSaveError(null)
      setMoveCount(0)
      setDefeatedEnemies(new Set())
      setCurrentBattle(null)
      setBlockMessage(null)
      resetInventoryRef.current() // ← Utiliser la ref
      victoryHandledRef.current = false
    }
  }, [level]) // ← Retirer resetInventory

  const isAdjacent = (
    row: number,
    col: number,
    revealedTiles: Set<string>
  ): boolean => {
    const adjacentPositions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]
    return adjacentPositions.some(([dRow, dCol]) => {
      const adjacentKey = `${row + dRow}-${col + dCol}`
      return revealedTiles.has(adjacentKey)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <p className="text-white text-2xl">Chargement du niveau...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!level) return null

  const currentScore = calculateScore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">{level.name}</h1>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <Home size={18} />
            Retour à l'accueil
          </button>
          <p className="text-white opacity-80 mb-1">{level.description}</p>
          <div className="flex justify-center gap-4 text-sm text-white opacity-70">
            <span>Difficulté : {level.difficulty}</span>
            <span>•</span>
            <span>
              {level.rows}×{level.cols}
            </span>
            <span>•</span>
            <span className="font-semibold">
              Statut: {gameStatus === "won" ? "🎉 GAGNÉ" : "En cours"}
            </span>
          </div>

          <div className="mt-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 inline-block">
            <div className="flex gap-6 text-white">
              <div>
                <p className="text-xs opacity-70">Déplacements</p>
                <p className="text-2xl font-bold">{moveCount}</p>
              </div>
              <div className="border-l border-white opacity-30"></div>
              <div>
                <p className="text-xs opacity-70">Score actuel</p>
                <p className="text-2xl font-bold text-yellow-300">
                  {currentScore}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Inventory items={inventory} />
          </div>

          {blockMessage && (
            <div className="mt-4 bg-red-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 max-w-md mx-auto animate-pulse">
              <AlertTriangle size={20} />
              <span className="font-semibold">{blockMessage}</span>
            </div>
          )}

          <button
            onClick={resetLevel}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RotateCw size={18} />
            Réinitialiser
          </button>
        </div>

        <Grid
          gridData={level.grid}
          rows={level.rows}
          cols={level.cols}
          revealedTiles={revealedTiles}
          onTileClick={handleTileClick}
          isAdjacent={isAdjacent}
          isAdjacentToPlayer={isAdjacentToPlayer}
          playerPosition={playerPosition}
          gameStatus={gameStatus}
        />

        {currentBattle && (
          <BattleModal
            enemyName={currentBattle.enemyName}
            onBattleEnd={handleBattleEnd}
          />
        )}

        {gameStatus === "won" && level && (
          <VictoryModal
            playerName={playerName}
            revealedTilesCount={revealedTiles.size}
            totalTiles={level.rows * level.cols}
            highscores={highscores}
            loadingScores={loadingScores}
            currentScoreId={currentScoreId}
            saveStatus={saveStatus}
            saveError={saveError}
            currentLevelId={level.id}
            hasNextLevel={level.id < 4}
            onResetLevel={resetLevel}
            onRetry={() => handleVictory(0)}
          />
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  )
}
