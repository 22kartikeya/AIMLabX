import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './components/Landing';
import Login from './components/login';
import TSP from './pages/TSP';
import AppBar from './components/AppBar';
import TicTacToe from './pages/TicTacToe';
import WaterJugHill from './pages/WaterJugHill';

function App() {

  return (
    <BrowserRouter>
      <AppBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/tsp" element={<TSP/>} />
        <Route path='/tic-tac-toe' element={<TicTacToe/>}/>
        <Route path='/water-jug-hill' element={<WaterJugHill/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;