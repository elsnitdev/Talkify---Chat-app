import mongoose from 'mongoose';
export const connectDB=async()=>{
    try{
        //ts-ignore
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("connect DB successful");
    }catch(error){
        console.log("connect DB fail ",error);
        process.exit(1);
    }
}