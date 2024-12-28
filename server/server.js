import express from 'express';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import expensesRoutes from "./routes/expensesRoutes.js";
import db from "./config/database.js"
import userRoutes from "./routes/userRoutes.js";



async function dbConnecting(){
  await db.connect();
  console.log("DB is connected")
}

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoutes);
app.use("/user",userRoutes);
app.use("/expenses",expensesRoutes);

app.listen(port,async () => {
  try{
    await dbConnecting();
    console.log(`Server running on port ${port}`);
  }
  catch(error){
    process.exit(1);
  }
});



export {db,app};
