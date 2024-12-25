import bycrypt from "bcrypt";
import {db} from "../server.js";
import dotenv from 'dotenv';


dotenv.config();

const userRegister= async(req,res)=>{
    const {name, email,password,budget,dateOfCreate}=req.body;
    if(!name||!email||!password||!budget||!dateOfCreate){
        return res.status(400).json({message:"not all the details included"});
    }
        try{
                const result= await db.query("SELECT * FROM users WHERE email=$1 OR name=$2",[email,name]);
            if(result.rows.length>0){
                return res.status(409).json({message:"email is already exists"});
            }
            const saltRounds=10;
            try{  
                const hash=await bycrypt.hash(password,saltRounds);   
                try{
                    await db.query("INSERT INTO users (name,email, password,budget,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6)"
                        ,[name,email,hash,budget,dateOfCreate,dateOfCreate]);

                    return res.status(201).json({message:"saved"});

                }
                catch(error){
                    console.log(error.message);
                    return res.status(500 ).json({message:"error"});
                }    
    
    
                    
    
                
            }
            catch(error){
                return res.status(500).json({message:"error"});
            }  
        }

        catch(error){
            return res.status(500).json({message:"error in DB"});
        }

};


const userLogin=async(req,res)=>{
    const {name,password}=req.body;
   try{
        const storedUser=await db.query("SELECT * FROM users WHERE name=$1",[name]);
        if(storedUser.rows.length<=0)
            return res.status(404).json({message:"user not found"});
        const hashedStoredPassword=storedUser.rows[0].password;
        const result=await bycrypt.compare(password,hashedStoredPassword);
        if(result){
            return res.status(200).json({message:"Login successful"});
        }
        else{
            return res.status(401).json({message:"Login Failed"});
        }
   }
   catch(error){
    return res.status(500).json({message:"error in DB"});
   }
}



export default  {
    userRegister
    ,userLogin
};