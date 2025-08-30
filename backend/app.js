import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {createServer} from "node:http";  //it is used to connect socket server with  express app
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectToSocket} from "./src/controllers/socketManager.js"
import router from "./src/routes/users.routes.js";

const app=express();
const server=createServer(app);
const io= connectToSocket(server)
const PORT=process.env.PORT|| 8000;

const corsOptions = {
  origin: "https://video-conferencing-app-frontend-bnw7.onrender.com",
  credentials: true, // allow cookies
};



app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb", extended:true}))
const url=process.env.MONGO_URL;
mongoose.connect(url)
console.log("DB Connented!")


app.use("/api/v1/users", router)

server.listen(PORT, ()=>{
    console.log(`app is listing on ${PORT}`)
})