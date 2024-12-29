import '../assets/styles/HamburgerMenu.css'; // Import the CSS for the button styling

function HamburgerButton({ toggleMenu }) {
    return (
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    );
  }
  
  export default HamburgerButton;
