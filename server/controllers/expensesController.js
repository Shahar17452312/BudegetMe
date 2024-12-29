import {db} from "../server.js";
import jwt from "jsonwebtoken";
import {jwtConfig} from "../config/jwt.js";


const getexpenses=async(req,res)=>{
    console.log(req.headers);
    const token = req.headers['authorization'].split(' ')[1];
    try{
        const decode=jwt.verify(token,jwtConfig.jwtSecret);
        const {id}=req.params
        console.log(decode);
        try{
            const result=await db.query("SELECT * FROM expenses WHERE user_id=$1",[id]);
            if(result.rows.length<=0){
                return res.status(404).json({message:"no expenses yet"});
            }
            return res.status(200).json({expenses:result.rows});
        }
    
        catch(err){
            return res.status(409).json({message:"error accured"});
    
        }
    }
    catch(error){
        console.error("error",error.message);
        return res.status(400).json({message:"Invalid Token"});
    }
};


const addExpense=async(req,res)=>{
    try{
            console.log(req.body);
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token,jwtConfig.jwtSecret);
        const {user_id,amount,description,category,date}=req.body;
        const expensDetailsToUpdate=Object.values(req.body);
        if(expensDetailsToUpdate.length<5)
            return res.status(409).json({message:"at least one of the details is missing"});
        expensDetailsToUpdate.forEach(element => {
            if(!element){
                return res.status(409).json({message:"at least one of the details is missing"});
            }
        });
        const expensDetails=[user_id,amount,description,category,date];


        try{
            await db.query("INSERT INTO expenses (user_id,amount,description,category,date) VALUES ($1,$2,$3,$4,$5)",expensDetails);
            return res.status(202).json({message:"Expense has been saved"});

        }
        catch(error){
            console.log(error.message);
            return res.status(409).json({message:"Error to save expense"});

        }
    }
    catch(error){
        console.log(error.message);
    }
    

    

}


const deleteExpense=async(req,res)=>{
    try{
        await db.query("DELETE FROM expenses WHERE id=$1",[req.params.id]);
        return res.status(200).json({message:"Expense has been deleted"});
    }
    catch(error){
        console.log(error.message);
        return res.status(409).json({message:"Error to delete expense"});


    }


}



export default {
    getexpenses,
    addExpense,
    deleteExpense
};