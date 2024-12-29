import express from "express";
import expensesController from "../controllers/expensesController.js";


const router=express.Router();

router.get("/:id",expensesController.getexpenses);
router.post("/addExpense/:id",expensesController.addExpense);
router.delete("/:id",expensesController.deleteExpense);



export default router;