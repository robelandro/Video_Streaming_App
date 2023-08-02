import { Request, Response } from "express";
import user from "../util/user";
import tokejwten from "../util/tokejwten";
import redisClient from "../util/redis";

class AuthControler {

    /**
     * Login new user then set token in redis and return it
     * @param req 
     * @param res 
     */
	static async conncet(req: Request, res: Response){
        try{
            const {userName, password} = req.body;

            if(!userName || !password){
                res.status(400).send({error: 'Missing parameters'});
            }
            else{
                // create new user
                const getUser = await user.getUser(userName, password);
                // generate token
                const token = tokejwten.generateToken(getUser);
                // save token in redis
                await redisClient.set(token, getUser._id.toString(), 1800);
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

    /**
     * logout user delete token in redis and return it
     * @param req 
     * @param res 
     */
    static async disconnect(req: Request, res: Response){
        try{
            const token = req.cookies.token;
            if(!token){
                res.status(400).send({error: 'Missing parameters'});
            }
            else{
                // delete token in redis
                await redisClient.del(token);
                // return token
                res.status(201).clearCookie('token').send({message: 'Disconnect'});
            }
        }
        catch(err: any){
            res.status(400).send({error: err.message});
        }
    }
}

export default AuthControler;
