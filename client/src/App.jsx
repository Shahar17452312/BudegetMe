import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {
  const [token] = useState(localStorage.getItem('accesstoken'));

  return (
    <Router>
      <Routes>
        {/* אם יש טוקן, נעבור לדף הבית. אם אין, נרנדר את דף הלוגין */}
        <Route path="/" element={token ? <Navigate to="/home"  /> : <Login />} />
        
        {/* אם יש טוקן, נרנדר את דף הבית. אם אין, נעבור לדף התחברות */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/" />} />
        <Route path="/edit-profile" element={token ? <EditProfile /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
