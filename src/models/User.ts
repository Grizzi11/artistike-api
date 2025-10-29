import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string; // hashed
  role: "fan" | "artist";
  isPremium?: boolean;
  avatarUrl?: string;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, minlength: 2 },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["fan","artist"], default: "fan" },
  isPremium:{ type: Boolean, default: false },
  avatarUrl:{ type: String }
}, { timestamps: true });

export default model<IUser>("User", userSchema);