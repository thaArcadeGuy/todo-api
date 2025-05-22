import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
    username: {
      type:String,
      unique: true,
      sparse: true
    },
    profilePicture: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);

export default User;