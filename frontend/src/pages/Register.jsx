import { useState } from "react";
import Input from "../components/Input.jsx"; // נניח שיש לך קומפוננטת Input
import "../../public/styles/Register.css"; // קובץ CSS עם עיצוב מתאים

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן תוכל להוסיף את הלוגיקה לשליחת הנתונים לשרת
    console.log(formData);
  };

  return (
    <div className="register-container">
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <Input
          type="text"
          placeholder="Username"
          ariaLabel="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <Input
          type="email"
          placeholder="Email"
          ariaLabel="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          placeholder="Password"
          ariaLabel="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="number"
          placeholder="Budget Amount"
          ariaLabel="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
        />
        <button className="register-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
