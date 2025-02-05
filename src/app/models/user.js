import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletAmount: { type: Number, default: 0 },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
