import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authUser=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized no token provided"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized invalid token"})
        }

        const user=await User.findById(decoded.userId).select('-password')

        if(!user){
            return res.status(401).json({message:"Unauthorized user not found"})
        }   

        req.user=user;
        next()
    }catch(err){
        return res.status(401).json({message:"Unauthorized invalid or expired token"})
    }
}