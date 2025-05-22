import express from "express";
import { userRegister, userLogin } from "../controllers/auth.controller.js";

const authRoute =express.Router();

authRoute.post("api/auth/register", userRegister);
authRoute.post("api/auth/login", userLogin);

export default authRoute