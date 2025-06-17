import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type:String,
      required: true,
      unique: true,
      sparse: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    firstName: String,
    lastName: String,
    profilePicture: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);

export default User;