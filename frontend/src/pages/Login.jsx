import { useNavigate } from 'react-router-dom';
import Input from "../components/Input.jsx";
import "../../public/styles/Login.css";
import { useEffect, useState } from 'react';
import axios from "axios";

function Login() {

    const navigate = useNavigate();
    const [flag,setFlag]=useState(true);
    const [formData,setFormData]=useState({
        name:"",
        password:""
    });

    function handleOnChange(e){
        setFormData((prevData)=>{
            return {
                ...prevData,
                [e.target.name]:e.target.value
            }
        })
    }
    function moveToRegister() {
        navigate("/register");
    }

    useEffect(()=>{
        const token=localStorage.getItem("accessToken");
        if(token){
            navigate("/home");

        }
    },[])

   async function handleOnSubmit(e){
            e.preventDefault()
            console.log("onSubmit");
        try{
            const response=await axios.post("http://localhost:3000/auth/login",{
                name:formData.name,
                password:formData.password
            });

            if(response.status!==202){
                setFlag(false);

            }

            localStorage.setItem("id",response.data.id);
            localStorage.setItem("name",response.data.name);
            sessionStorage.setItem("accessToken",response.data.accessToken);
            sessionStorage.setItem("refreshToken",response.data.refreshToken);

            navigate("/home");
         

        }
        catch(e){
            console.log(e.message);
            setFlag(false);
        }
   }



    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Welcome to BudgetMe</h1>
                <form onSubmit={handleOnSubmit}>
                    <Input type="name" placeholder="Username" ariaLabel="username" name="name" value={formData.name} onChange={handleOnChange}/>
                    <Input type="password" placeholder="Password" ariaLabel="password" name="password" value={formData.password} onChange={handleOnChange} />
                    <button className="login-btn" type="submit">Log In</button>
                    <h1 hidden={flag}>error to log in</h1>
                </form>
                
                <div className="register-info">
                    <p>If you dont have an account, click below to register</p>
                    <button className="register-btn" onClick={moveToRegister}>Register</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
