import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Explicitly set the collection name
const User = mongoose.model("User", userSchema, "Users");  // "Users" matches your collection name
export default User