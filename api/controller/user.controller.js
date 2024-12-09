import bcrypt from 'bcryptjs'
import { errorHandler } from '../utils/error'
import User from '../models/user.js'

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