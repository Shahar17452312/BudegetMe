import "../assets/styles/About.css";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

function About() {
  return (
    <div className="about-container">
      <HamburgerMenu />
      <h1>About Us</h1>
      <p>
        Welcome to <strong>BudgetMe</strong>, your one-stop solution for seamless user experiences. 
        Our goal is to make your life easier, one feature at a time. We believe in simplicity, innovation, and user-centric design.
      </p>
      <div className="about-info">
        <h2>Our Mission</h2>
        <p>
          Our mission is to create intuitive, high-quality software that meets the unique needs of every user. 
          With cutting-edge technology and a dedicated team, we are here to bring your ideas to life.
        </p>
        <h2>Why Choose Us?</h2>
        <p>
          - <strong>Innovation:</strong> We stay ahead of the curve, so you do not have to. <br />
          - <strong>Quality:</strong> Excellence is our standard. <br />
          - <strong>Support:</strong> We are here for you, every step of the way.
        </p>
      </div>
    </div>
  );
}

export default About;

