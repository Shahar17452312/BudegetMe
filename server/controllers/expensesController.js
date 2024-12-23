import db from "../server.js";


const getexpenses=async(req,res)=>{
    const {id}=req.params

    try{
        const result=await db.query("SELECT * FROM expenses WHERE user_id=$1",[id]);
        if(result.rows.length<=0){
            return res.status(404).send(JSON.stringify({message:"no expenses yet"}));
        }
        return res.status(200).send(JSON.stringify({expenses:result.rows}));
    }

    catch(err){
        return res.status(409).send(JSON.stringify({message:"error accured"}));

    }
};




export default {getexpenses};