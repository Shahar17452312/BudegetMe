import {db} from "../server.js";
import bcrypt from "bcrypt";
const getUser=async(req,res)=>{
    const {id}=req.params;
    try{
        console.log(id);
        const result=await db.query("SELECT name,email,budget FROM users WHERE id=$1",[id]);
        if(result.rows.length===0){
            return res.status(404).send(JSON.stringify({message:"not found"}));
        }
        return res.status(200).send(JSON.stringify({userDetails:result.rows[0]}));
    }
    catch(error){
        console.log(error.message);
        return res.status(409).send(JSON.stringify({message:"error"}));

    }
   

}

const updateUser=async(req,res)=>{

    const {name,email,password,budget,created_at}=req.body;
    const {id}=req.params;
    try{
        const result=await db.query("SELECT * FROM users WHERE id=$1",[id]);
        const currentUser=result.rows[0];
        var toUpdate={};
        if(!id){
            return res.status(409).send(JSON.stringify({message:"Error"}));
        }
        if (name&&name!==currentUser.name) toUpdate.name = name;
        if (email&&email!==currentUser.email) toUpdate.email = email;
        if (password){
            const check=await bcrypt.compare(password,currentUser.password);
            if(!check){
                 const hash=await bcrypt.hash(password,10);
                 toUpdate.password=hash;
            }
        }
        if (budget&&budget!==currentUser.budget) toUpdate.budget = budget;

        if(created_at){
            const createAtFromReuest=new Date(created_at);
            if (createAtFromReuest.toISOString()!==currentUser.created_at.toISOString()) {
            
                toUpdate.created_at = created_at;
                toUpdate.updated_at = created_at;
            } 
        
        }
        
    
        const setClause = Object.keys(toUpdate).map((key,index)=>`${key}=$${index+1}`).join(', ');
        const values = Object.values(toUpdate);

    
        if(values.length===0){
            return res.status(409).send(JSON.stringify({message:"There is no data to change"}));
        }
    
    
       
        values.push(id);
    
        var query="UPDATE users SET "+setClause +" WHERE id=$"+values.length;
        console.log(query);
    
        try{
            await db.query(query,values);
            return res.status(200).send(JSON.stringify({message:"user updated"}));
        }
        catch(error){
            console.log(error.message);
            return res.status(409).send(JSON.stringify({message:"Error to update user"}));
        }
    }
    catch(error){
        console.log(error.message);
        return res.status(409).send(JSON.stringify({message:"Error to update user"}));

    }

   


    
}

const deleteUser=async(req,res)=>{
    const {id}=req.params;
    try{
        await db.query("DELETE FROM expenses WHERE id=$1",[id]);
        await db.query("DELETE FROM users WHERE id=$1",[id]);
        return res.status(200).send(JSON.stringify({message:"user has been deleted"}));

    }
    catch(error){
        console.log(error.message);
        return res.status(409).send(JSON.stringify({message:"error"}));
    }
    
}


export default 
{getUser
,updateUser,
deleteUser};