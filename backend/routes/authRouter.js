import express from "express";
import authController from "../controllers/authController.js"

const router=express.Router();


router.post("/register",authController.registerController);
router.post("/login",authController.loginController);
router.post("/refresh-token",authController.refreshTokenController);


export default router;