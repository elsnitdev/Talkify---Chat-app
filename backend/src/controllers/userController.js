
export const authMe=async(req,res)=>{
    try{
        const user = req.user; // get from authMiddleware
        console.log(user);
        return res.status(200).json({user:user,message:"user"});
    }
    catch(error){
        console.error("fail when call authNMe",error);
        return res.status(500).json({message:"error from server"});
    }
}  
export const test =async(req,res)=>{
    return res.sendStatus(204);

}