import  { useState } from 'react';
import '../assets/styles/HamburgerMenu.css'; // לקישור לקובץ CSS

function HamburgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // סטייט לניהול פתיחה/סגירה של התפריט

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // משנה את מצב התפריט (פתוח/סגור)
  };

  return (
    <div className="hamburger-container">
      <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      {isMenuOpen && (
        <div className="side-menu">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/profile">profile</a></li>
            <li><a href="/edit-profile">edit profile</a></li>
            <li><a href="/about">about</a></li>

          </ul>
        </div>
      )}
    </div>
  );
}

export default HamburgerMenu;
