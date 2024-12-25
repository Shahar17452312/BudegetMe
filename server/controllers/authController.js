import bycrypt from "bcrypt";
import {db} from "../server.js";
import dotenv from 'dotenv';


dotenv.config();

const userRegister= async(req,res)=>{
    const {name, email,password,budget,dateOfCreate}=req.body;
    if(!name||!email||!password||!budget||!dateOfCreate){
        return res.status(400).send(JSON.stringify({message:"not all the details included"}));
    }
        const result= await db.query("SELECT * FROM users WHERE email=$1",[email]);
        if(result.rows.length>0){
            return res.status(409).send(JSON.stringify({message:"email is already exists"}));
        }
        else{
            const element=await db.query("SELECT * FROM users WHERE name=$1",[name]);
            if(element.rows.length>0)
                return res.status(409).send(JSON.stringify({message:"user name is already exists"}));
            
        }
        const saltRounds=10;
        
        bycrypt.hash(password,saltRounds,async(err,hash)=>{
            if(err){
                return res.status(500 ).send(JSON.stringify({message:"error to save user"}));
            }
            else{
                try{
                    await db.query("INSERT INTO users (name,email, password,budget,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6)"
                        ,[name,email,hash,budget,dateOfCreate,dateOfCreate]);

                    return res.status(201).send(JSON.stringify({message:"saved"}));

                }
                catch(error){
                    console.log(error.message);
                    return res.status(500 ).send(JSON.stringify({message:"error"}));
                }


            }

        });  

};


const userLogin=async(req,res)=>{
    const {name,password}=req.body;
    const storedUser=await db.query("SELECT * FROM users WHERE name=$1",[name]);
    if(storedUser.rows.length<=0)
        return res.status(404).send(JSON.stringify({message:"user not found"}));
    const hashedStoredPassword=storedUser.rows[0].password;
    const result=await bycrypt.compare(password,hashedStoredPassword);
    if(result){
        return res.status(200).send(JSON.stringify({message:"Login successful"}));
    }
    else{
        return res.status(401).send(JSON.stringify({message:"Login Failed"}));
    }
}


export default  {
    userRegister
    ,userLogin
};