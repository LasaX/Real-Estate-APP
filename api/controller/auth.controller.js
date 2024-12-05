import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";

export const signUp=async(req,res,next)=>{
    const {username,email,password} =req.body;
    const hashPassword=bcrypt.hashSync(password,8)
    const newUser= new User({username,email,hashPassword});
    try{
        await newUser.save();
        res.status(201).json('user create sucessfully');
        
    }catch(error){
        next(error)
    }

}