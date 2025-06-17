import express from "express";
import auth from "../middleware/auth.middleware.js";
import {getUserProfile, updateUserProfile, updateUserPassword} from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.get("/me", auth, getUserProfile);
userRoute.put("/me", auth, updateUserProfile);
userRoute.put("/me/password", auth, updateUserPassword);

export default userRoute;