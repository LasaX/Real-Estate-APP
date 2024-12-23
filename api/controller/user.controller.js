import bcrypt from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import User from '../models/user.js'
import Listing from '../models/listing.js'

export const updateUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'you can only update your own account'))
    try{
        if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password,10)
    }

    const updatedUser=await User.findByIdAndUpdate(req.params.id,{
        $set : {
            username : req.body.username,
            email : req.body.email,
            hashPassword : req.body.password,
            avatar : req.body.avatar
        }
    },{new : true})
    const {password, ...rest} =updatedUser._doc
    res.status(200).json(rest)

}catch(error){
    next(error)

}
}


export const deleteUser = async (req,res,next) =>{
    if(req.user.id === req.params.id) return next (errorHandler(401,'you can only delete your own account !'))
    try{
       await User.findByIdAndDelete(req.params.id)
       res.clearCookie('acess_token');
       res.status(200).json('User has been deleted !')
    }catch(error){
        next(error)
    }
}

export const getUserListings =  async (req,res,next) =>{
    if (req.user.id !== req.params.id) {
        try{
            const listings = await Listing.find({userRef : req.params.id});
            res.status(200).json(listings);

        }catch (error){
            next(error);
        }
    }else{
        return next(errorHandler(401,'you can only view your listings !'))
    }
}

export const getUser = async (req,res,next) =>{
    try{

        const user = await User.findById(req.params.id);
        if (!user) return next(errorHandler(404,'User not founded !'));
        const {Password : pass, ...rest}= user.doc;
        res.status(200).json(rest);

    } catch(error){

    }
}