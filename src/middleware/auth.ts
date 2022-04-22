import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { AuthMiddlewareRequest, DecodedPayload } from "../types/request/AuthMiddleware";

export const auth = async (
  req: AuthMiddlewareRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (req.headers && req.headers.authorization?.startsWith("Bearer")) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as DecodedPayload;

      const user = await User.findById(decoded._id).select('-password');
      if (!user) return res.status(401).json({ message: "Not authorized" });
      req.user = user;
      next();
    } catch (error) {
        res.status(401).json({message:'Not Authorized'})
    }
  }
  if(!token) return res.status(401).json({message:'Not authorized'})
};
