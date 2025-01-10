import express from "express";
import budgetController from "../controllers/budgetController.js";

const router=express.Router();


router.get("/:id",budgetController.getBudget);
router.post(":id",budgetController.postBudget);
router.delete("/:id",budgetController.deleteBudget);


export default router;