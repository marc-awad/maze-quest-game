import { useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { RotateCw, Home, AlertTriangle } from "lucide-react"

// Composants
import VictoryModal from "../components/VictoryModal"
import BattleModal from "../components/BattleModal"
import Inventory from "../components/Inventory"
import Grid from "../components/Grid"

// Hooks personnalisés
import { usePlayer } from "../utils/PlayerContext"
import { useInventory } from "../hooks/useInventory"
import { useGameLevel } from "../hooks/useGameLevel"
import { useGameState } from "../hooks/useGameState"
import { useBattle } from "../hooks/useBattle"
import { useTileInteraction } from "../hooks/useTileInteraction"
import { usePlayerMovement } from "../hooks/usePlayerMovement"
import { useHighscore } from "../hooks/useHighscore"

/**
 * Composant principal du jeu
 * Orchestre tous les hooks et gère les interactions utilisateur
 */
export default function Game() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { playerName } = usePlayer()

  // Hook : Chargement du niveau
  const { level, loading, error, resetLevel } = useGameLevel(levelId)

  // Hook : État du jeu (position, révélations, statut)
  const {
    revealedTiles,
    playerPosition,
    gameStatus,
    moveCount,
    revealTile,
    movePlayer,
    calculateScore,
    resetGameState,
  } = useGameState(level)

  // Hook : Inventaire (armes, clés, objets)
  const {
    inventory,
    addItem,
    hasWeapon,
    hasKey,
    reset: resetInventory,
  } = useInventory()

  // Hook : Combats
  const {
    currentBattle,
    isEnemyDefeated,
    startBattle,
    endBattle,
    resetBattles,
  } = useBattle()

  // Hook : Interactions avec les tuiles
  const {
    blockMessage,
    handleDoorInteraction,
    handleMonsterInteraction,
    createKeyItem,
    createWeaponItem,
    createGeneralItem,
    resetMessages,
  } = useTileInteraction()

  // Hook : Validation des mouvements
  const {
    isAdjacentToPlayer,
    isAdjacentToRevealed,
    canInteract,
    isValidPosition,
    isPlayerTile,
  } = usePlayerMovement(level, playerPosition, gameStatus)

  // Hook : Highscores
  const {
    highscores,
    currentScoreId,
    saveStatus,
    saveError,
    saveHighscore,
    resetHighscore,
  } = useHighscore(level, playerName, gameStatus, calculateScore)

  // Redirection si pas de pseudo
  useEffect(() => {
    if (!playerName) {
      navigate("/")
    }
  }, [playerName, navigate])

  // Redirection si pas de levelId
  useEffect(() => {
    if (!levelId) {
      navigate("/")
    }
  }, [levelId, navigate])

  /**
   * Gestion du clic sur une tuile
   * Centralise toute la logique d'interaction
   */
  const handleTileClick = useCallback(
    (row: number, col: number) => {
      // Vérifications préalables
      if (!level || !canInteract(currentBattle)) return
      if (isPlayerTile(row, col)) return
      if (!isAdjacentToPlayer(row, col)) {
        console.log(`Tuile [${row}, ${col}] non adjacente - clic ignoré`)
        return
      }

      const key = `${row}-${col}`
      const tileType = level.grid[row][col]
      console.log(`🎮 Tuile cliquée : [${row}, ${col}] - Type: ${tileType}`)

      // Révéler la tuile si pas déjà révélée
      if (!revealedTiles.has(key)) {
        revealTile(row, col)
      }

      // === GESTION DES PORTES ===
      if (tileType.startsWith("D:")) {
        const doorColor = tileType.split(":")[1]
        if (!handleDoorInteraction(doorColor, hasKey)) {
          return // Porte verrouillée
        }
      }

      // === GESTION DES MONSTRES ===
      if (tileType.startsWith("M:")) {
        const monsterType = tileType.split(":")[1]
        const interaction = handleMonsterInteraction(
          monsterType,
          row,
          col,
          hasWeapon,
          isEnemyDefeated
        )

        if (interaction === "blocked") return // Pas d'arme
        if (interaction === "battle") {
          startBattle(monsterType, row, col)
          return // Combat en cours
        }
        // Si "defeated", continuer normalement
      }

      // === GESTION DES MURS ===
      if (tileType === "W") {
        console.log(`🧱 Mur à [${row}, ${col}] - déplacement impossible`)
        return
      }

      // === DÉPLACEMENT DU JOUEUR ===
      movePlayer(row, col)
      console.log(`👤 Joueur déplacé à [${row}, ${col}]`)

      // === COLLECTE D'OBJETS ===
      if (tileType.startsWith("K:")) {
        const keyColor = tileType.split(":")[1]
        addItem(createKeyItem(keyColor))
        console.log(`🗝️ Clé ${keyColor} ramassée`)
      }

      if (tileType.startsWith("W:")) {
        const weaponId = tileType.split(":")[1]
        addItem(createWeaponItem(weaponId))
        console.log(`⚔️ Arme ramassée`)
      }

      if (tileType.startsWith("I:")) {
        const itemId = tileType.split(":")[1]
        addItem(createGeneralItem(itemId))
        console.log(`📦 Objet ramassé`)
      }
    },
    [
      level,
      canInteract,
      currentBattle,
      isPlayerTile,
      isAdjacentToPlayer,
      revealedTiles,
      revealTile,
      handleDoorInteraction,
      hasKey,
      handleMonsterInteraction,
      hasWeapon,
      isEnemyDefeated,
      startBattle,
      movePlayer,
      addItem,
      createKeyItem,
      createWeaponItem,
      createGeneralItem,
    ]
  )

  /**
   * Gestion de la fin d'un combat
   */
  const handleBattleEnd = useCallback(() => {
    const battlePosition = endBattle()
    if (!battlePosition) return

    // Révéler la tuile du monstre vaincu
    const key = `${battlePosition.row}-${battlePosition.col}`
    if (!revealedTiles.has(key)) {
      revealTile(battlePosition.row, battlePosition.col)
    }

    // Déplacer le joueur sur la position du monstre
    movePlayer(battlePosition.row, battlePosition.col)
    console.log(
      `✅ Combat terminé, joueur à [${battlePosition.row}, ${battlePosition.col}]`
    )
  }, [endBattle, revealedTiles, revealTile, movePlayer])

  /**
   * Gestion des touches du clavier (flèches directionnelles)
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!level || !playerPosition || !canInteract(currentBattle)) return

      // Ignorer si focus sur input/textarea
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

      if (!isValidPosition(newRow, newCol)) {
        console.log(`⚠️ Position hors limites : [${newRow}, ${newCol}]`)
        return
      }

      handleTileClick(newRow, newCol)
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [
    level,
    playerPosition,
    canInteract,
    currentBattle,
    isValidPosition,
    handleTileClick,
  ])

  /**
   * Réinitialisation complète du niveau
   */
  const handleResetLevel = useCallback(() => {
    resetLevel() // Recharger la grille originale
    resetGameState() // Reset position, révélations, etc.
    resetInventory() // Vider l'inventaire
    resetBattles() // Reset ennemis
    resetMessages() // Reset messages
    resetHighscore() // Reset état highscore
  }, [
    resetLevel,
    resetGameState,
    resetInventory,
    resetBattles,
    resetMessages,
    resetHighscore,
  ])

  // === RENDU CONDITIONNEL ===

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

  // === RENDU PRINCIPAL ===

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête avec infos niveau */}
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

          {/* Score et déplacements */}
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

          {/* Inventaire */}
          <div className="mt-4 flex justify-center">
            <Inventory items={inventory} />
          </div>

          {/* Message de blocage */}
          {blockMessage && (
            <div className="mt-4 bg-red-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 max-w-md mx-auto animate-pulse">
              <AlertTriangle size={20} />
              <span className="font-semibold">{blockMessage}</span>
            </div>
          )}

          {/* Bouton reset */}
          <button
            onClick={handleResetLevel}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RotateCw size={18} />
            Réinitialiser le niveau
          </button>
        </div>

        {/* Grille de jeu */}
        <Grid
          gridData={level.grid}
          rows={level.rows}
          cols={level.cols}
          revealedTiles={revealedTiles}
          onTileClick={handleTileClick}
          isAdjacent={isAdjacentToRevealed}
          isAdjacentToPlayer={isAdjacentToPlayer}
          playerPosition={playerPosition}
          gameStatus={gameStatus}
        />

        {/* Modal de combat */}
        {currentBattle && (
          <BattleModal
            enemyName={currentBattle.enemyName}
            onBattleEnd={handleBattleEnd}
          />
        )}

        {/* Modal de victoire */}
        {gameStatus === "won" && level && (
          <VictoryModal
            playerName={playerName}
            revealedTilesCount={revealedTiles.size}
            totalTiles={level.rows * level.cols}
            highscores={highscores}
            loadingScores={false}
            currentScoreId={currentScoreId}
            saveStatus={saveStatus}
            saveError={saveError}
            currentLevelId={level.id}
            hasNextLevel={level.id < 4}
            onResetLevel={handleResetLevel}
            onRetry={() => saveHighscore(0)}
          />
        )}
      </div>

      {/* Animations CSS */}
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
