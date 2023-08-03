import { Request, Response, NextFunction } from "express";
import user from "../util/user";
import tokejwten from "../util/tokejwten";
import redisClient from "../util/redis";
import RiseError from "../util/error";

class UserControler{

    /**
     * This function is used to create a new user and return token
     * @param req 
     * @param res 
     */
    static async newUser(req: Request, res: Response, next: NextFunction) {
        try{
            const {userName, password} = req.body;

            if(!userName || !password){
                throw new RiseError(400, 'Missing parameters');
            }
            else{
                // create new user
                const newUser = await user.addUser(userName, password);
                // generate token
                const token = tokejwten.generateToken(newUser);
                // save token in redis
                await redisClient.set(token, newUser._id.toString(), 1800);
                await newUser.save();
                // return token
                res.status(201).cookie(
                    'token', token, {
                        httpOnly: true,
                        maxAge: 1800000,
                        sameSite: 'none'
                    }
                ).json({token: token});
            }
        }
        catch(err: any){
            next(err);
        }
    }
}

export default UserControler;
