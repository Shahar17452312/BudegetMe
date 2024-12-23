import express from 'express';
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/register",authController.userRegister);
router.post("/login",authController.userLogin);

export default router;
