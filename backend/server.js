 import express from 'express'
 import cors from 'cors'
 import 'dotenv/config'
 import connectDB from './config/mongodb.js' 
 import connectCloudinary from './config/cloudinary.js'

 //app config

 const app = express()
 const port = process.env.PORT||4000
 connectDB()
 connectCloudinary()

 //MIDDLEWARES
 app.use(express.json())
 app.use(cors());

 app.get('/',(req,res)=>{
    res.send("API WORKING by aditya");
 })

 app.listen(port,()=>console.log("SERVER STARTED",port))