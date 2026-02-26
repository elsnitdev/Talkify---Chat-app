import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";
const ACCESS_TOKEN_TTL='15s';
const REFRESH_TOKEN_TTL=14*24*60*60; //14 days
export const signUp=async(req,res)=>{
     try{
        const  {
            username,password,email,firstName,lastName
        }=req.body;
        if(!username||!password||!email||!firstName||!lastName){
            return res.status(400).json({message:"missed information"});
        }
        //check user name existed
        const duplicate =await User.findOne({username});
        if(duplicate){
            return res.status(409).json({message:"User name already existed"});
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password,10); // salt=10 make 10 times hash password and give the result after 10 times calculate
        //create new user
        await User.create({
        username,
         hashedPassword,
        email,
        displayName: `${firstName} ${lastName}`
    });
        //return
        return res.sendStatus(204);
     }catch(err){
        console.log('fail when call signUp',err);
        return res.status(500).json({message:"Server Error"});
     }
}
export const signIn=async(req,res)=>{
    try{
        //get inputs
        const {username,password}=req.body;
        if(!username||!password){
            return res.status(400).json({message:"miss information"});
        }  const user=await User.findOne({username});
         if(!user){
            return res.status(401).json({message:"user name wrong "});
         } 
        //get hashed password from db compare with password input
          const passwordCorrect=await bcrypt.compare(password,user.hashedPassword);

        //if equal create accessToken with JWT
            if(!passwordCorrect){
            return res.status(401).json({message:"password wrong "});    
            };
            const accessToken=jwt.sign({userId : user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_TTL})
        // create refresh token 
            const refreshToken =crypto.randomBytes(64).toString('hex');
        //create new session to save refresh token
await Session.create({
    userId:user._id,
    refreshToken,
    expiresAt:new Date(Date.now()+REFRESH_TOKEN_TTL),
})
        //return refresh token in cookie
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge:REFRESH_TOKEN_TTL
    });
        //return access token in response 
        res.status(200).json({message:`User ${user.displayName} login successful`,accessToken:accessToken,user:user});
    }catch(err){
        console.log('fail when call signIn',err);
        return res.status(500).json({message:"Server Error"});
     }
}
export const signOut = async(req,res)=>{
    try{
        // get refresh token from cookie 
        const token = req.cookies?.refreshToken;
        if(token){
            //delete token in session
            await Session.deleteOne({refreshToken:token});

            //delete token in cookie
            res.clearCookie("refreshToken");
        }
        return res.sendStatus(204);
    }catch(error){
        console.log("error call sign out ", error);
        return res.status(500).json({message:"Server error"});
    }


}
export const refreshToken=async(req,res)=>{
    try{
        // lấy refresh token từ cookie
        const token =req.cookies?.refreshToken;
        if(!token){
               return res.status(401).json({message:"token không tồn tại"})
        }
        //so sánh với refresh token trong db
        const session =await Session.findOne({refreshToken:token})
        if(!session){
               return res.status(403).json({message:"token không hợp lệ"})
        }
        //kiểm tra xem hết hạn chưa
        if(session.expiresAt<new Date()){
            return res.status(403).json({message:"token đã hết hạn"})
        };
        //tạo access token mới
        const accessToken =jwt.sign({
            userId:session.userId
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_TTL});
        //return
       return res.status(200).json({ accessToken });
    
    }catch(error)
    {
        console.error(error);
        return res.status(500).json({message:"lỗi hệ thống"})
    }
}