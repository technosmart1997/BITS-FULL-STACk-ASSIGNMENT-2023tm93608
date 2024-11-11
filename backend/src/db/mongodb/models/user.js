import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export const User = mongoose.model("users", userSchema);
