import verify from "../utils/authHelper.js";
import db from "../config/dbConfig.js";


const getAllExpenses=async(req,res)=>{
    const header=req.headers;
    const check=verify(header,req.params.id);
    if(check.status!==200){
       return res.status(check.status).json({message:check.message});
    }

    const {id}=check.payload;

    try{
        const data=await db.query("SELECT * FROM expenses WHERE user_id=$1",[id]);
        if(data.rows.length===0){
            return res.status(404).json({message:"expenses not found"});

        }
        return res.status(200).json(data.rows);
    }
    catch (error) {
        console.log(error.message);
        if (process.env.NODE_ENV === "test") {
            return res.status(500).json({ message: error.message, stack: error.stack });
        } else {
            return res.status(500).json({message:"Database query failed"});
        }
    }
    

};


const postExpense=async(req,res)=>{
    const header=req.headers;
    const check=verify(header,req.params.id);
    if(check.status!==200){
       return res.status(check.status).json({message:check.message});
    }

    const {id}=check.payload;
 

    const {amount,category,description,date_of_creation}=req.body;
    if(!amount||!category||!description||!date_of_creation){
        return  res.status(400).json({message:"there is missing fields in request"});
    }

    try{
        await db.query("INSERT INTO expenses (user_id,amount,category,description,date_of_creation) VALUES ($1,$2,$3,$4,$5)",
            [id,amount,category,description,date_of_creation]
        );

        return res.status(200).json({message:"Expense saved"});
    }
    catch (error) {
        console.log(error.message);
        if (process.env.NODE_ENV === "test") {
            return res.status(500).json({ message: error.message, stack: error.stack });
        } else {
            return res.status(500).json({message:"Failed to save expense"});
        }
    }

    
};



export default {getAllExpenses,postExpense};