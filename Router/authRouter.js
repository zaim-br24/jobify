import { login, register, updateUser } from "../Controllers/authController.js";
import  express from "express";
const router = express.Router()

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser').patch(updateUser);


export default router