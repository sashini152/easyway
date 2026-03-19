const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "vendor", "admin"],
      default: "student",
    },
    noShowCount: {
      type: Number,
      default: 0,
    },
    penaltyStatus: {
      type: String,
      enum: ["none", "warning", "blocked"],
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);