import express from "express";
import userController from "../controllers/userController.js";

const router=express.Router();


router.get("/:id",userController.getUser);
router.patch("/:id",userController.patchUser);
router.post("/:id",userController.postUser);
router.delete("/:id",userController.deleteUser);


export default router;