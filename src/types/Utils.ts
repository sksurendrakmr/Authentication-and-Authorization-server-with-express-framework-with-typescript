import { Request } from "express";

export type CustomRequest<T> = Omit<Request,'body'> & {body:T} 