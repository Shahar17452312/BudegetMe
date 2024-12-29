import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import moneyImage from '../assets/images/money.png';
import '../assets/styles/login.css';
import axios from 'axios';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [hidden,setHidden]=useState(true);

  const handleRegister = async() => {
    navigate('/register'); 
  };

  async function onSubmitHandler(event) {
    event.preventDefault();
    console.log("on submit");
  
    try {
      const result = await axios.post("http://localhost:8080/auth/login", {
        name: name,
        password: password
      });
      const accesstoken=result.data.accesstoken;
      const refreshToken=result.data.refreshToken;
      console.log(result.data);
  
      if (result.status === 200) {
        console.log(result.status);
        localStorage.setItem('accesstoken', accesstoken);
        localStorage.setItem('refreshtoken', refreshToken);
        console.log(result.data);
        localStorage.setItem('user_id',result.data.user.id);
        localStorage.setItem('user_name',result.data.user.name);
        navigate("/home");
        


      } else {
        setHidden(false);
      }
    } catch (error) {
      console.error("Login error:", error);
        setHidden(false);
    }
  }
  

  return (

    <div className="login-container">
        <img src={moneyImage} style={{ width: '50%', height: '50%' }} alt="dollar" />
      <div className="login-form">
        <h2> Login</h2>
        <form onSubmit={onSubmitHandler}>
          <Input type="name" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} autocomplete="username" />
          <Input type="password" placeholder="password" value={password } onChange={(e) => setPassword(e.target.value)} autocomplete="new-password-password" />
          <button type="submit">login</button>
          <p hidden={hidden}>wrong user name or password</p>

        </form>
     
        <div className="register-link">
            <button onClick={handleRegister}>Not registered? Join now</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
