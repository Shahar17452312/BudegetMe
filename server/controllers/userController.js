import db from "../server.js";


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

const updateUser=(req,res)=>{
    
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