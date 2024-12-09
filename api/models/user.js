import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required:true,
        unique :true
    },
    email :{
        type : String,
        required:true,
        unique :true
    },
    hashPassword :{
        type : String,
        required:true,
        
    },
    avatar  :{
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPgEmtQwrC7r80BUtMhPaF6okDFFu41i5fRQ&s"

    }
},{timestamps : true});

const User = mongoose.model('User',userSchema)

export default User;