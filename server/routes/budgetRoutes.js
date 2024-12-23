import express from "express";
import expensesController from "../controllers/expensesController.js";


const router=express.Router();

router.get("/:id",expensesController.getexpenses);


export default router;