import bycrypt from "bcrypt";
import {db} from "../server.js";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import {jwtConfig} from "../config/jwt.js";


dotenv.config();

const userRegister= async(req,res)=>{
        const {name, email,password,date_of_creation,amount}=req.body;
        if(!name||!email||!password||!date_of_creation||!amount){
            return res.status(400).json({message:"not all the details included"});
        }
            try{
                const result= await db.query("SELECT * FROM users WHERE email=$1 OR name=$2",[email,name]);
                console.log(result);
                if(result.rows.length>0){
                    return res.status(409).json({message:"email or user name is already exists"});
                }
                const saltRounds=10;
                try{  
                    const hash=await bycrypt.hash(password,saltRounds);
                    const usersQuety="INSERT INTO users (name,email, password,date_of_creation) VALUES ($1,$2,$3,$4) RETURNING id,name";
                    try{
                        const data=await db.query(usersQuety,[name,email,hash,date_of_creation]);
                        const user=data.rows[0];
                        try{
                            const budgetQuet="INSERT INTO budget (user_id,amount) VALUES ($1,$2)"
                            await db.query(budgetQuet,[user.id,amount]);

                        }
                        catch(error){
                            console.log(error.message);
                            res.status(500).json({mesaage:"error"});
                        }
                       
                        const token = jwt.sign({ id: user.id, username: user.name }
                            , jwtConfig.jwtSecret
                            , { expiresIn: jwtConfig.jwtExpiresIn }
                        );

                        return res.status(201).json({
                            token:token,
                            user:{
                                id:user.id,

                            }
                        });

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

    }


const userLogin=async(req,res)=>{
    const {name,password}=req.body;

   try{
        const storedUser=await db.query("SELECT id,email,name,password FROM users WHERE name=$1",[name]);
        if(storedUser.rows.length<=0)
            return res.status(404).json({message:"user not found"});
        const hashedStoredPassword=storedUser.rows[0].password;
        try{
            const result=await bycrypt.compare(password,hashedStoredPassword);
            if(result){
                const token = jwt.sign({ id: storedUser.rows[0].id, name: storedUser.rows[0].name }, jwtConfig.jwtSecret, { expiresIn: jwtConfig.jwtExpiresIn });
                res.status(200).json({ token });
            }
            else{
                return res.status(401).json({message:"Login Failed"});
            }

        }
        catch(error){
            console.error("error:",error.message);
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