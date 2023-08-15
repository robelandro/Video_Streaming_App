import { Response, Request, NextFunction} from "express";
import AppError from "../utils/apperror";
import { decodeToken } from "../utils/tokejwten";
import tokenExtract from "../utils/tokenExtract";

/**
 * @description protect route for weak authentication 
 * if your is loged out and and user not in database will fail
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get token from header
    const token = tokenExtract(req);
    if (!token) return next(new AppError("Unauthorized", 401));
    // decode data
    const decodedData = decodeToken(token);
    req.user = decodedData;
    next()
  }
  catch (error){
    next(error)
  }
}
