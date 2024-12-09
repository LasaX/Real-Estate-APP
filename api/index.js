import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserRouter from './routes/user.route.js';
import authRouter from './routes/Auth.route.js'
import cookieParser from 'cookie-parser';


dotenv.config();

const app =express()

app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('connected to database')
})
.catch((err)=>{
    console.log(err)
})

app.use ('/api/user',UserRouter);
app.use('/api/auth',authRouter);
 
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'internal sever error';
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})

app.listen(3000,()=>{
    console.log('sevrer running on port 3000')
})