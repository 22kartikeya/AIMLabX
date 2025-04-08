import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './components/Landing';
import Login from './components/login';
import TSP from './pages/TSP';
import AppBar from './components/AppBar';
import TicTacToe from './pages/TicTacToe';
import WaterJugHill from './pages/WaterJugHill';
import EightPuzzleSolver from './pages/EightPuzzleSolver';
import AstarEightPuzzle from './pages/astar_eight_puzzle';
import MarcusResolver from './pages/MarcusResolver';
import Footer from './components/Footer';
import About from './pages/About';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <AppBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/tsp" element={<TSP />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/water-jug-hill" element={<WaterJugHill />} />
            <Route path="/eight-puzzle-gbfs" element={<EightPuzzleSolver />} />
            <Route path="/astar-eight-puzzle" element={<AstarEightPuzzle />} />
            <Route path="/marcus-resolver" element={<MarcusResolver />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;