import validator from "validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../config/stream.js";

export const signup = async (req, res) => {
    const {fullName,email,password}=req.body
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Please enter a valid email address"})
        }

        const existingUser= await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User email already exists"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const idx = Math.floor(Math.random()*1000)+1
        const randomAvatar=`https://api.dicebear.com/10.x/avataaars/svg?backgroundColor=00bbff&accessoriesColor=262e33,65c9ff,5199e4,e6e6e6,929598,3c4f5c,b1e2ff,a7ffc4,ffdeb5,ffafb9,ffffb1,ff488e,ff5c5c,ffffff&clothesColor=262e33,5199e4,25557c,e6e6e6,929598,3c4f5c,b1e2ff,a7ffc4,ffafb9,ffffb1,ff5c5c,ffffff&borderRadius=50&${idx}`

        const newUser = await User.create({
            fullName,
            email,
            password:hashedPassword,
            image:randomAvatar
        })

        try {
            await upsertStreamUser({
            id:newUser._id.toString(),
            name:newUser.fullName,
            image:newUser.image
        })

        console.log(`Stream user upserted successfully for ${newUser.fullName}`);
        } catch (error) {
            console.error(`Error upserting Stream user for ${newUser.fullName}:`, error);
        }

        const token =  jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"})

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(201).json({message:"User created successfully",user:newUser})  

    }catch(err){
        console.log("Error in signup controller", err)
        res.status(500).json({message:"Internal server error"})
    }
}   

export const login =async (req, res) => {
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({message:"Please fill all the fields"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"})
        }

        const token =  jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        const safeUser = await User.findById(user._id).select("-password");

        res.status(200).json({message:"User logged in successfully",user:safeUser})

    }catch(err){
        console.log("Error in login controller", err)
        res.status(500).json({message:"Internal server error"})
    }
}


export const logout=(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({message:"User logged out successfully"})
}

export const onboard=async(req,res)=>{ 
    try{
        const userId=req.user._id
        const {fullName,bio,skill,language,location}=req.body
        if(!fullName || !bio || !skill || !language || !location){
            return res.status(400).json({message:"Please fill all the fields",
                missingFields:
                   [ !fullName && "fullName",
                    !bio && "bio",
                    !skill && "skill",
                    !language && "language",
                    !location && "location"
                ].filter(Boolean)
            })
        }

        const updatedUser=await User.findByIdAndUpdate(userId,{
            ...req.body,
            isOnboarded:true
        },{new:true})

        if(!updatedUser){
            return res.status(404).json({message:"User not found"})
        }

        try {
            await upsertStreamUser({
            id:updatedUser._id.toString(),
            name:updatedUser.fullName,
            image:updatedUser.image
        })

        console.log(`Stream user updated successfully for ${updatedUser.fullName}`);
        } catch (error) {
            console.error(`Error updating Stream user for ${updatedUser.fullName}:`, error);
        }

        res.status(200).json({message:"User onboarded successfully",user:updatedUser})
    }catch(err){
        console.log("Error in onboard controller", err)
        res.status(500).json({message:"Internal server error"})
    }}  