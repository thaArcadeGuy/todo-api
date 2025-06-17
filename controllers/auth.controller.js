import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !email) {
      return res.status(400).json({
        error: "All fields are required"
      });
    };

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already in use"});
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ error: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword});

    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: "1d" } 
    );

    res.status(201).json({ 
      message: "Registration successful",
      token,
      user: {
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({error: "Server Error"});
  }
}

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email not registered, try again with valid user email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect, try again with valid password" });
    }

    const token = jwt.sign({userId:user._id}, JWT_SECRET, { expiresIn: "1d"});
    res.json({ token, user: { email: user.email, username: user.username } });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server Error" });
  }
}

export {
  userRegister,
  userLogin
}