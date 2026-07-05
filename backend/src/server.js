import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";


const app=express();
const PORT=process.env.Port||5000;

await connectDB()//establish connection

//middleware setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://nexchat-1-37qd.onrender.com" // frontend url
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));
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
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})