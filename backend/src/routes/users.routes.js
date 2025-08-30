import express from "express"
import {register,login, addToHistory, getUserHistory, logout }from "../controllers/userController.js"
import userVerification from "../middleware/authmiddleware.js"


const router = express.Router();

router.post("/login",login)
router.post("/logout",logout)
router.post("/register",register)
router.get("/verify",userVerification)
router.post("/add_to_activity", addToHistory)
router.get("/get_all_activity", getUserHistory)

export default router;