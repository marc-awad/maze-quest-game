import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { PlayerProvider } from "./utils/PlayerContext"
import HomePage from "./pages/HomePage"
import Game from "./pages/Game"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:levelId" element={<Game />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PlayerProvider>
  )
}

export default App
