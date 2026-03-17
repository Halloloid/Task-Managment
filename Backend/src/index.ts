import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB,disconnectDB } from "./config/db.js";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modules/authentication/auth.routes.js';
import taskRoutes from './modules/task/task.routes.js';

// Load environment variables
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "https://task-managment-vert.vercel.app/",
    credentials: true
}))
app.use(cookieParser())

app.use(express.json({
    verify:(req:any,_res,buf)=>{
        req.rawBody = buf.toString();
    }
}))
app.use(express.urlencoded({extended:true}))

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((_:Request,res:Response,next:NextFunction)=>{
    res.status(404).json({"Message":"No Such Routes"})
})

const server = app.listen(PORT,()=>{
    console.log(`Server is Running on PORT:${PORT}`)
})

//Handle unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.error("Unhadled Rejction",err);
    server.close(async () =>{
        await disconnectDB();
        process.exit(1);
    });
});

// handle uncaught exception
process.on("uncaughtException",async(err)=>{
    console.error("unCaught Exception",err);
     await disconnectDB();
     process.exit(1);
})

//Graceful Shutdown
process.on("SIGTERM",async()=>{
    console.log("SIGTERM recevied ,shutting down gracefully");
    server.close(async () =>{
        await disconnectDB();
        process.exit(0);
    });
})
