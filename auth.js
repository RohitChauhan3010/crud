import jwt from "jsonwebtoken";
import catchError from "./error.js"; 
import { con, makeDb } from "./db.config.js";
const executeQuery = makeDb();

export const authentication =catchError(async(req,res,next)=>{
try {
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        res.status(401).json({
            status:true,
            msg:"token not found!"
        })
    }

    const decoded=jwt.verify(token,"sqlsecretkey")

    if(decoded){
        req.user= decoded.user;
    }
    next()

} catch (error) {
    console.log(error)
    return res.status(500).json({
        status:false,
        msg:"invalid"
    })
}
    
})