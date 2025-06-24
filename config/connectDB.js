import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env variables

export async function connectDB(){
    try{
       await mongoose.connect(process.env.MONGODB_URL) 
       
       //This gets the default connection object from Mongoose.
       const connection = mongoose.connection;
       
       connection.on('connected',()=>{
        console.log("MongoDB connected")
       })

       connection.on('error',(error)=>{
        console.log("MongoDB runtime error:",error)
       })

    } 
    catch(error){
      console.log("MongoDB Intial connection error ", error);
      throw error;  
    } 

}
