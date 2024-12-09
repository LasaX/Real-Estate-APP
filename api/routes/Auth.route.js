import express from 'express'
import {google, SignIn, signUp} from '../controller/auth.controller.js'

const router = express.Router();

router.post("/signup",signUp);
router.post("/signin",SignIn);
router.post("/google",google)

export default router;