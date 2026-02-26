import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization  

export const protectedRoute=(req,res,next)=>{
try{
    // get token form header

    const authHeader = req.headers['authorization'];
    const token =authHeader&&authHeader.split(' ')[1]; //<token>
    if(!token){
        return res.status(403).json({message:'can not find access token'})
    }
    //confirm token valid 
 
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,decodedUser)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"access token out date or wrong"});
        }

  

    //find user

    const user = await User.findById(decodedUser.userId).select('-hasPassword'); // take all information from user without password
    if(!user){
        return res.status(404).json({message:"User undefine"});

    }

    //return user in res

    req.user=user;
    next();
  })
}
catch(err){
    console.log('error JWT',err);
    return res.status(500).json({message:"server error"});
}
}