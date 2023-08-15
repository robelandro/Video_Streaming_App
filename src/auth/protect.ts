import { Response, Request, NextFunction} from "express";
import AppError from "../utils/apperror";
import { decodeToken } from "../utils/tokejwten";
import Users from "../api/users/dal";
import tokenExtract from "../utils/tokenExtract";
import redisClient from "../utils/redisutils";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get token from header
    const token = tokenExtract(req);
    if (!token) return next(new AppError("Unauthorized", 401));
    // decode data
    const decodedData = decodeToken(token);
    // get current user
    const userData = await Users.getByUserName(decodedData.userName);
    // get id using token from redis
    const userId = await redisClient.get(token);
    if (!userId) return next(new AppError("Unauthorized", 401));
    if (!userData || (`${userData._id}` !== userId)) return next(new AppError("Unauthorized", 401));
    req.user = userData;
    next()
  }
  catch (error){
    next(error)
  }
}
