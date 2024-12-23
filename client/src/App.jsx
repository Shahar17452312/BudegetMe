import Input from './components/Input'
import './App.css' 
import {useState} from 'react';
import axios from "axios";

function App() {

  const [email,setemail]=useState("ssss");
  const [password,setPassword]=useState("sssss");


 

  async function register(event){
    event.preventDefault(); 
    console.log("Trying to submit:", email, password);
    try{
      const result=await axios.post("http://localhost:8080/users/register",{
        email:email,
        password:password
      });
      console.log(result.data);
    }
    catch(err){
      console.log(err.message);
    }
    setemail(""); // מנקה את הערך של email
    setPassword("");
    console.log("Trying to submit:", email, password);
  }

  return (
  <div>
    <h1>logo</h1>
      <h2>BudgetMe </h2>
    <form className="form-container" onSubmit={register} method="post">
     <Input  name="email" value={email} l="Email"/>
     <Input  name="password" value={password} l="Password"/>
     <Input  name="Confirm Password" value={password} l="Confirm Password"/>

     <button type="submit">login</button>
     <p>haven't signed yet?</p>
     <a href="">register</a>
    </form>
  </div>
   

  )
}

export default App;
