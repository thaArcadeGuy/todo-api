import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already in use"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword});

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({error: "Server Error"})
  }
}

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not registered, try again with valid user email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect, try again with valid password" });
    }

    const token = jwt.sign({id:user._id}, JWT_SECRET, { expiresIn: "1d"});
    res.json({ token, user: { email: user.email, username: user.username } });

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}

export {
  userRegister,
  userLogin
}