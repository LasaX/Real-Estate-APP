import express from 'express'
import {SignIn, signUp} from '../controller/auth.controller.js'

const router = express.Router();

router.post("/signup",signUp);
router.post("/signin",SignIn);

export default router;