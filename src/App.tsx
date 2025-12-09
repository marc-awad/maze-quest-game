import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { PlayerProvider, usePlayer } from "./utils/PlayerContext"
import HomePage from "./pages/HomePage"
import Game from "./pages/Game"

function AppRoutes() {
  const { setPlayerName } = usePlayer()

  return (
    <Routes>
      <Route path="/" element={<HomePage onSetPlayerName={setPlayerName} />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

function App() {
  return (
    <PlayerProvider>
      <Router>
        <AppRoutes />
      </Router>
    </PlayerProvider>
  )
}

export default App
