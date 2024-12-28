import Input from "../components/Input";
import moneyImage from "../assets/images/money.png"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function Register() {

  const [name,setName]=useState("");
  const [password,setPassword]=useState("");
  const [email,setEmail]=useState("");
  const [budget,setBudget]=useState(0);
  const navigate=useNavigate();


  async function onSubmitHandler(e){
    e.preventDefault();
    const date=new Date().toISOString().slice(0, 19).replace('T', ' ');

   try{
      const result=await axios.post("http://localhost:8080/auth/register",
        {
          name:name,
          email:email,
          password:password,
          date_of_creation:date,
          amount:budget
        }
      );

      console.log(result.status);

      if(result.status===201){
        localStorage.setItem("id",result.data.user.id);



        alert("user has been registres");
        navigate("/Home");
      }
   }
   catch(error){
    console.error(error);
    alert("email or name are already registerd");
   }

  
  }



  

  return (
    <div className="login-container">
    <img src={moneyImage} style={{ width: '50%', height: '50%' }} alt="dollar" />
  <div className="login-form">
    <h2> Register</h2>
    <form onSubmit={onSubmitHandler}>
      <Input type="name" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} autocomplete="username" />
      <Input type="password" placeholder="password" value={password } onChange={(e) => setPassword(e.target.value)} autocomplete="new-password-password" />
      <Input type="email " placeholder="email" value={email } onChange={(e) => setEmail(e.target.value)} autocomplete="new-email" />
      <Input type="number " placeholder="budget amount" value={budget } onChange={(e) => setBudget(e.target.value)} autocomplete="new-amount" />
      <button type="submit">login</button>
    </form>
  </div>
</div>
  );
}

export default Register;
