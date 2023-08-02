import { Request, Response } from "express";
import user from "../util/user";
import tokejwten from "../util/tokejwten";
import redisClient from "../util/redis";

class UserControler{

    /**
     * This function is used to create a new user and return token
     * @param req 
     * @param res 
     */
    static async newUser(req: Request, res: Response) {
        try{
            const {userName, password} = req.body;

            if(!userName || !password){
                res.status(400).send({error: 'Missing parameters'});
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
                ).send({token: token});
            }
        }
        catch(err: any){
            res.status(400).send({error: err.message});
        }
    }
}

export default UserControler;
