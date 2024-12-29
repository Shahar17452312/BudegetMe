import {db} from "../server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {jwtConfig} from "../config/jwt.js"
const getUser=async(req,res)=>{
    const token = req.headers['authorization'].split(' ')[1];
    console.log("in here");
    try{
            jwt.verify(token, jwtConfig.jwtSecret);
            const {id}=req.params;
            console.log(id);
        try{
            const usersResult=await db.query("SELECT name,email,date_of_creation FROM users WHERE id=$1",[id]);
            const budgetResult=await db.query("SELECT amount FROM budget WHERE user_id=$1",[id]);
            console.log(usersResult.rows[0]);
            console.log(budgetResult.rows[0]);

            if(usersResult.rows.length===0||budgetResult.rows.length===0){
                return res.status(404).json({message:"not found"});
            }
            const data={
                ...usersResult.rows[0],
                ...budgetResult.rows[0]
            }
            return res.status(200).json(data);
        }
        catch(error){
            console.log(error.message);
            return res.status(409).json({message:"error"});

        }
    }
    catch(error){
        return res.status(400).json({message:"Invalid token"});
    }

    
   

}

const updateUser=async(req,res)=>{
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, jwtConfig.jwtSecret, async (err, decoded) => {
        if (err) {
          return res.status(401).send('Invalid token');
        }
    });
    const {name,email,password,date_of_creation}=req.body;
    const {id}=req.params;
    if(!id){
        return res.status(400).json({message:"Error"});
    }
    try{
       
        const result=await db.query("SELECT * FROM users WHERE id=$1",[id]);
        const currentUser=result.rows[0];
        var toUpdate={};
        
        if (name&&name!==currentUser.name) toUpdate.name = name;
        if (email&&email!==currentUser.email) toUpdate.email = email;
        if (password){
            const check=await bcrypt.compare(password,currentUser.password);
            if(!check){
                 const hash=await bcrypt.hash(password,10);
                 toUpdate.password=hash;
            }
        }
        if(date_of_creation){
            const createAtFromReuest=new Date(date_of_creation);
            if (createAtFromReuest.toISOString()!==currentUser.created_at.toISOString()) {
            
                toUpdate.date_of_creation = date_of_creation;
            } 
        
        }
        
    
        const setClause = Object.keys(toUpdate).map((key,index)=>`${key}=$${index+1}`).join(', ');
        const values = Object.values(toUpdate);

    
        if(values.length===0){
            return res.status(200).json({message:"There is no data to change"});
        }
    
    
       
        values.push(id);
    
        var query="UPDATE users SET "+setClause +" WHERE id=$"+values.length+" RETURNING id,name";
        console.log(query);
    
        try{
            const updatedUser=await db.query(query,values);
            const newToken = jwt.sign(
                { id: updatedUser.id, username: updatedUser.name },
                jwtConfig.jwtSecret,
                { expiresIn: jwtConfig.jwtExpiresIn }
              );
          
              return res.status(200).json({ token: newToken });
        }
        catch(error){
            console.log(error.message);
            return res.status(500).json({message:"Error to update user"});
        }
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Error to update user"});

    }

   


    
}

const deleteUser=async(req,res)=>{
    const {id}=req.params;
    try{
        await db.query("DELETE FROM expenses WHERE id=$1",[id]);
        await db.query("DELETE FROM budget WHERE id=$1",[id]);
        await db.query("DELETE FROM users WHERE id=$1",[id]);
        return res.status(200).json({message:"user has been deleted"});
    }
    catch(error){
        console.log(error.message);
        return res.status(409).json({message:"error"});
    }
    
}


export default 
{getUser
,updateUser,
deleteUser};