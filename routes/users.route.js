import express from "express";
import auth from "../middleware/auth.middleware.js";
import {getUserProfile, updateUserProfile, updateUserPassword} from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.get("api/users/me", auth, getUserProfile);
userRoute.put("api/users/me", auth, updateUserProfile);
userRoute.put("api/users/me/password", auth, updateUserPassword);

export default userRoute;