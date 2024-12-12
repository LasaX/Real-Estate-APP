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
        const validPassword= bcrypt.compareSync(password,validUser.hashPassword);
        if(!validPassword) return next(errorHandler(401,'wrong credentials'));
        const token= jwt.sign({id:validUser._id},process.env.JWT);
        const{password:pass,...rest}=validUser._doc;
        res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
    }catch(error){
        next(error)
    }
};

export const google =async(req,res,next)=>{
    try{
        const user= await User.findOne({email :req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT);
            const {password :pass, ...rest}=user._doc;
            res.cookie('acess_token',token,{httpOnly : true}).status(200).json(rest);
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashedPassword=bcrypt.hashSync(generatedPassword,10);
            const newUser=new User({
                username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),email :req.body.email,hashPassword :hashedPassword,avatar : req.body.photo 
            });
            await newUser.save();
            const token =jwt.sign({id :newUser._id},process.env.JWT);
            const {password : pass, ...rest}=newUser._doc;
            res.cookie('acess_token',token,{httpOnly :true}).status(200).json(rest);

        }
    }catch(error){
        next(error)
    }
}

export const signOut = async ()=>{
    try{
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out')

    }catch(error){
        next(error)
    }
}