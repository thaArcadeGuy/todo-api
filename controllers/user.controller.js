import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const {firstName, lastName, username, email, profilePicture} = req.body;
    
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (profilePicture) updates.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates, 
      {new: true, runValidators: true}
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

const updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required" })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "new password must be at least 8 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User Not FOund" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
}

export {
  getUserProfile,
  updateUserProfile,
  updateUserPassword
}