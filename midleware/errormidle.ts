import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { ErrorType } from "../interface";
/**
 * Midleware Handle all errors
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
const errorHandler: ErrorRequestHandler = (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({ error: err.message});
};
export default errorHandler;
