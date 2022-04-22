import mongoose,{Model} from "mongoose";
import jwt from 'jsonwebtoken';
import { UserMethods, UserType } from "../types/request/User";

const userSchema = new mongoose.Schema<UserType,Model<UserType,{},UserMethods>>({
  name: {
    type: String,
    maxlength: 200,
    required: [true,"Please add a name"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  email: {
    type: String,
    required: [true,"Please enter a valid email"],
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});

userSchema.methods.generateToken = function(){
  return jwt.sign({_id:this._id,isAdmin:this.isAdmin},process.env.JWT_SECRET as string)
}

export const User = mongoose.model<UserType,Model<UserType,{},UserMethods>>('User',userSchema);

