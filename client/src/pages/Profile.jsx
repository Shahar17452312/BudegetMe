import "../assets/styles/profile.css"
import NavBar from '../components/Navbar.jsx';


function Profile() {
  return (

    <div className="profile-page">
      <NavBar/>
      <h1>Profile Page</h1>
      <p>Details about the user...</p>
    </div>
  );
}

export default Profile;
