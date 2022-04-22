import { Request } from "express";
import { UserType } from "./User";

export type AuthMiddlewareRequest = Request & {
  user?: UserType;
};

export type DecodedPayload = {
  _id: string;
  isAdmin: boolean;
};
