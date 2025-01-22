import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';

function App() {
  const token = sessionStorage.getItem("accessToken");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={token ? <Home /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={token ? <Navigate to="/home" /> : <Login />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
