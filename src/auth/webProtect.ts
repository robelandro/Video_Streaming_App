import e, { Response, Request, NextFunction} from "express";
import AppError from "../utils/apperror";
import { decodeToken } from "../utils/tokejwten";
import Users from "../api/users/dal";
import tokenExtract from "../utils/tokenExtract";
import redisClient from "../utils/redisutils";
import { loginPageRender } from "../utils/viewrender";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = tokenExtract(req);
    if (!token) throw new AppError("Unauthorized", 401);
    const decodedData = decodeToken(token);
    const userData = await Users.getByUserName(decodedData.userName);
    const userId = await redisClient.get(token);
    if (!userId) throw new AppError("Unauthorized", 401);
    if (!userData || (`${userData._id}` !== userId)) throw new AppError("Unauthorized", 401);
    req.user = userData;
    next()
  }
  catch (error){
    loginPageRender(res, next)
  }
}
