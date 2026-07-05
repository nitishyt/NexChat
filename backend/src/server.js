import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";


const app=express();
const Port=process.env.Port||5000;

await connectDB()//establish connection

//middleware setup
app.use(cors({
    origin: process.env.CLIENT_URL, // Allow requests from the frontend URL
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())

//define routes
app.use('/api/auth',authRouter)
app.use('/api/users',userRouter)
app.use('/api/chat',chatRouter)
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});
//start the server
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})