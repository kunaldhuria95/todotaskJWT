import express from 'express'
import { register, login, logout, refreshAccessToken } from '../controllers/authController';
import { authenticateUser } from '../middlewares/authenticate-user';
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
//secured routes
router.delete("/logout",authenticateUser,logout)
router.post("/refresh-token",refreshAccessToken)


export default router;