import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './database/db.js';
import userRouter from './routes/userRouter.js'
import blogRouter from './routes/blogRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/admin", userRouter)
app.use("/blog", blogRouter)
app.use("/category", categoryRouter)

// Connect to MongoDB

connectDB()


// Listen on port

app.listen(process.env.PORT || 3000);
console.log("Server is running on port: " + process.env.PORT);
