import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import "./App.css"
import EditProfile from './pages/EditProfile.jsx';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={<Home/>}
        />

        <Route
          path="edit-profile"
          element={<EditProfile/>}
        
        />
        <Route 
          path="/" 
          element={<Login />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
