import fs from "fs";
import tokejwten from "../util/tokejwten";
import redisClient from "../util/redis";
import express from "express";

const EXCEPTION_PATH: string[] = ['/users', '/connect', '/disconnect']; // the path that the user can access without authentication

/**
 * a middleware to check if the user is authenticated
 * @param req 
 * @param res 
 * @param next 
 */
async function checkAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  try {
    const isException = EXCEPTION_PATH.includes(req.originalUrl);
    if (isException) {
      next();
    } else {
      const token: string = req.cookies.token;
      if (token) {
        const userID = await tokejwten.decodeToken(token);
        const isUser = (await redisClient.get(token)) === userID; // check if the token is in the redis
        if (isUser) {
          res.locals.userId = userID;
          next();
        } else {
          sendLoginHtml(res);
        }
      } else {
        sendLoginHtml(res);
      }
    }
  } catch (error) {
    sendLoginHtml(res);
  }
}

/**
 * Login page
 * @param res 
 */
function sendLoginHtml(res: express.Response): void {
  const header = { 'Content-Type': 'text/html' };
  res.status(401).header(header);
  fs.readFile('./view/login.html', (err, data) => {
    if (err) {
      res.end('error');
    } else {
      res.end(data);
    }
  });
}


export default checkAuth;
