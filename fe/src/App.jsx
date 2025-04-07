import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { Landing } from './components/Landing';
import Login from './components/login';
import TSP from './pages/TSP';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/tsp" element={<TSP/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;