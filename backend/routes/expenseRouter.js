import express from "express";
import expensController from "../controllers/expensController.js";

const router=express.Router();

router.get("/:id",expensController.getAllExpenses);
router.post("/:id",expensController.postExpense);


export default router;