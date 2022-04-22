import { RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import { User } from "../models/User";
import { UserType } from "../types/request/User";
import { CustomRequest } from "../types/Utils";
import { AuthMiddlewareRequest } from "../types/request/AuthMiddleware";

export const registerUser = async (req: CustomRequest<UserType>, res: Response) => {
  const { error } = validateUserForRegister(req.body);
  if (error) return res.status(400).json({message:error.details[0].message});

  const user = await User.findOne({email:req.body.email});
  
  if(user) return res.status(400).json({message:'User already registered!'})

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);


  const savedUser = await User.create<UserType>({
    name: req.body.name,
    password: hashedPassword,
    email: req.body.email,
    isAdmin:req.body.isAdmin
  });

  const token = savedUser.generateToken();
  res.status(201).header('x-auth-token',token).json({user:{
      name:savedUser.name,
      email:savedUser.email,
      token:token
  }});
};

export const getUserDetails:RequestHandler = async(req:AuthMiddlewareRequest,res)=>{
  res.status(200).json({user:req.user})
}

export const login = async(req:CustomRequest<Omit<UserType,'name'|'isAdmin'>>,res:Response)=>{
  const {error} = validateUserForLogin(req.body);
  if(error) return res.status(400).json({message:error.details[0].message})

  const user = await User.findOne({email:req.body.email});  
  if(!user) return res.status(400).json({message:'Please Enter a valid email'});

  const isPasswordMatched = await bcrypt.compare(req.body.password,user.password);
  if(!isPasswordMatched) return res.status(400).json({message:'Please Enter a valid email or password'});

  const token = user.generateToken();
  res.status(200).json({user:{
    name:user.name,
    email:user.email,
    token:token
  }});
}

const validateUserForRegister = (user: UserType) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean(),
  });

  return schema.validate(user);
};

const validateUserForLogin = (user:Omit<UserType,'name'|'isAdmin'>) => {
  const schema = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required()
  })

  return schema.validate(user);
}
