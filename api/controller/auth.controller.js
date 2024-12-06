import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'
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

export const SignIn = async (req,res,next) =>{
    const {email,password}=req.body;
    try{

        const validUser= await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'user not found !'));
        const validPassword= bcrypt.compareSync(password.validUser.password);
        if(!validPassword) return next(errorHandler(401,'wrong credentials'));
        const token= jwt.sign({id:validUser._id},process.env.JWT);
        const{password:pass,...rest}=validUser._doc;
        res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
    }catch(error){
        next(error)
    }
}