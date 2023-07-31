import { login, register, updateUser } from "../Controllers/authController.js";
import  express from "express";
const router = express.Router()
import authenticateUser from '../middleware/auth.js'

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser').patch(authenticateUser, updateUser);


export default router