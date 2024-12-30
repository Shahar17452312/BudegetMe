import { useEffect, useState } from 'react';
import '../assets/styles/profile.css'; // קובץ עיצוב
import axios from 'axios';
import HamburgerMenu from '../components/HamburgerMenu.jsx';

function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState('');
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("accesstoken");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("this is id " + id);

    const date_of_creation = new Date();

    try {
      axios.put("http://localhost:8080/user/" + id, {
        name,
        email,
        password,
        budget,
        date_of_creation
      }, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      alert('Profile updated!');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = () => {
    console.log(id);

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        axios.delete("http://localhost:8080/user/" + id, {
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        alert('Account deleted successfully!');
        localStorage.clear(); // לנקות נתונים מקומיים
        window.location.href = '/'; // להפנות לדף הבית או לדף אחר
      } catch (error) {
        console.log(error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    console.log("the id is " + id);

    try {
      axios.get("http://localhost:8080/user/" + id, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((result) => {
        setName(result.data.name);
        setEmail(result.data.email);
        setBudget(result.data.amount);
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <div className="edit-profile-container">
      <HamburgerMenu />
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter your budget"
          />
        </div>
        <button type="submit" className="submit-btn">Save Changes</button>
        <button type="button" className="delete-btn" onClick={handleDeleteUser} style={{ backgroundColor: 'red', color: 'white', marginTop: '10px' }}>
          Delete Account
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
