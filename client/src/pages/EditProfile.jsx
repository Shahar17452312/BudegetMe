import { useEffect, useState } from 'react';
import '../assets/styles/profile.css'; // קובץ עיצוב
import axios from 'axios';
import HamburgerMenu from '../components/HamburgerMenu.jsx';


function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן תוכל להוסיף את הלוגיקה לשמירת השינויים
    alert('Profile updated!');
  };

  useEffect(()=>{

    const id=localStorage.getItem("id");
    console.log("the id is "+id);
    const token=sessionStorage.getItem("token");
    

    try{
      axios.get("http://localhost:8080/user/"+id,{

        headers: {
          'Authorization': `Bearer ${token}`
        }
  
      }).then((result)=>{
        setName(result.data.name);
        setEmail(result.data.email);
        setBudget(result.data.amount);
      });
    }
    catch(error){
      console.log(error.message);

    }

  
    

  },[]);

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
      </form>
    </div>
  );
}

export default EditProfile;
