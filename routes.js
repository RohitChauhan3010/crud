import express from "express";
import { Register,login } from "./user.controllers.js"
import { addProduct,getProduct, updateProduct,deleteProduct,searchQuery,pagenation } from "./product.controller.js";
import {authentication} from "./auth.js";

export const userRoutes = express.Router();

userRoutes.post("/register", Register);
userRoutes.post("/login",login)


userRoutes.post("/product",authentication, addProduct)
userRoutes.get("/getproduct",authentication,getProduct)
userRoutes.patch("/updateproduct/:id",authentication,updateProduct)
userRoutes.delete("/deleteproduct/:id",authentication,deleteProduct)
userRoutes.get("/getquery",searchQuery)
userRoutes.get("/pagenation",pagenation)