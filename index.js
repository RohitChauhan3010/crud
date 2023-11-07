import express from "express";
import {con} from './db.config.js'
import dotenv from 'dotenv';
import { userRoutes } from "./routes.js";

con.connect();
dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/",(req,res)=>{
    res.status(201).send({msg:"my first project on mysql"})
})


app.use("/user",userRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  })
  