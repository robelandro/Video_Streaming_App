import { RequestHandler } from "express";
import Users from "./dal";
import { generateToken } from "../../utils/tokejwten";
import redisClient from "../../utils/redisutils";
import configs from "../../configs";
import tokenExtract from "../../utils/tokenExtract";
import AppError from "../../utils/apperror";

export const createNewUser: RequestHandler = async (req, res, next) => {
  try {
    const { userName, password } = <UserRequest.IUserInput>req.value;
    const newUser = await Users.CreateNew({
      userName,
      password,
    });

    // token generation
    const token = generateToken({
      id: newUser._id,
      userName: newUser.userName,
    });

    // Save token in redis
    await redisClient.set(
      token,
      `${newUser._id}`,
      Number(configs.jwt.expires_in)
    );

    // Send response
    res.status(200).json({
      status: "SUCCESS",
      message: `${newUser.userName} Created Successfuly`,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { userName, password } = <UserRequest.IUserInput>req.value;
    const loginUser = await Users.userLogin({
      userName,
      password,
    });

    // token generation
    const token = generateToken({
      id: loginUser._id,
      userName: loginUser.userName,
    });

    // Save token in redis
    await redisClient.set(
      token,
      `${loginUser._id}`,
      Number(configs.jwt.expires_in)
    );

    // Send response
    res.status(200).cookie(
      'token', token)
      .json({
      status: "SUCCESS",
      message: `${loginUser.userName} Loged in Successfuly`,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    const token = tokenExtract(req);
    if (!token) throw new AppError("Unauthorized", 401);
    // remove token in redis
    await redisClient.del(token);

    // Send response
    res.status(200).clearCookie('token').json({
      status: "SUCCESS",
      message: "Logged out",
    });
  } catch (error) {
    next(error);
  }
};
