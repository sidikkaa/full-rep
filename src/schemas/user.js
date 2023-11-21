import mongoose from "mongoose";
import passport from "passport";
const userSchema=new mongoose.Schema();
userSchema.plugin(p);
export const userModel=mongoose.model("user",userSchema);