import express from "express";
import {config} from "dotenv"
import { db } from "./config/db";
import userRouter from './routes/User'

const dotenv = config();
const app = express();
db();

app.use(express.json());

app.use("/api/user",userRouter)

app.listen(5000, () => {
  console.log("Start Listening...");
});
