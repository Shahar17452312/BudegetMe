import { useNavigate } from 'react-router-dom';
import Input from "../components/Input.jsx";
import "../../public/styles/Login.css";

function Login() {

    const navigtae=useNavigate();
    function moveToRegister(){

        navigtae("/register");

    }


  return (
    <div className="login-container">
      <h1>Welcome to BudgetMe</h1>
      <form action="/login">
        <Input placeholder="Username" ariaLabel="username" />
        <Input placeholder="Password" ariaLabel="password" />
        <button className="login-btn" type="submit">Log In</button>
      </form>
      
      <div className="register-info">
        <p>If you dont have an account, click below to register</p>
        <button className="register-btn" onClick={moveToRegister}>Register</button>
      </div>
    </div>
  );
}

export default Login;
