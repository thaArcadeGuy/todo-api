import express from "express";
import { userRegister, userLogin } from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.post("/register", userRegister);
authRoute.post("/login", userLogin);

export default authRoute