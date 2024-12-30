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
    console.log("update user is not implemented yet");
    
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        // מחיקה מטבלאות התלויות
        await db.query("DELETE FROM expenses WHERE user_id=$1", [id]);
        await db.query("DELETE FROM budget WHERE user_id=$1", [id]);
        // מחיקת המשתמש
        await db.query("DELETE FROM users WHERE id=$1", [id]);

        return res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(409).json({ message: "Error occurred while deleting user" });
    }
};



export default 
{getUser
,updateUser,
deleteUser};