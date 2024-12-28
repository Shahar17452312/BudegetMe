import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home";
import Profile from './Profile.jsx';
import EditProfile from './EditProfile.jsx';
import About from './About.jsx';
import NavBar from '../components/Navbar.jsx';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
