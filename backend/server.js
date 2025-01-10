import express from "express";
import db from "./config/dbConfig.js";
import userRouter from "./routes/userRouter.js";
import expensRouter from "./routes/expenseRouter.js";
import budgerRouter from "./routes/budgetRouter.js";
import authRouter from "./routes/authRouter.js";

const app=express();
const port=process.env.SERVER_PORT;


async function dbConnecting(){
    await db.connect();
        console.log("db connected");
  
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user",userRouter);
app.use("/expense",expensRouter);
app.use("/budget",budgerRouter);
app.use("/auth",authRouter);








app.listen(port,async()=>{
    try{
        await dbConnecting();
        console.log("Listening on port "+port);
    }
    catch(error){
        console.log("error to connect server");
        process.exit(1);
    }
});


