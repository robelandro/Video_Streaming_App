import jwt, { Algorithm } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { homedir } from "os";
import { TokenJWTType, UserType } from "../interface";
import user from "./user";
import { Types } from "mongoose";
import RiseError from "./error";

/**
 * TokenJWT class used to generate and decode JWT tokens
 */
class TokenJWT implements TokenJWTType {

  /**
   * Generate a token using the private key and payload
   * private key is should be stored in home directory named "jwtRS256.key"
   * @param payload 
   * @returns token returned as string
   */
  generateToken(payload: any): string {
    // create plain object from payload
    payload = JSON.parse(JSON.stringify(payload));
    payload = {
      _id: payload._id,
    }
    // Read the private key from a file
    const privateKey: string = fs.readFileSync(
      path.join(homedir(), "jwtRS256.key"),
      "utf-8"
    );

    // Define the options for the JWT
    const options: jwt.SignOptions = {
      algorithm: "RS256" as Algorithm,
      expiresIn: "1h",
    };

    // Encode the JWT using the private key
    const token = jwt.sign(payload, privateKey, options);

    return token as string;
  }

  /**
   * this function decode the token using the public key
   * @param token 
   * @returns 
   */
  async decodeToken(token: string): Promise<string> {
    // Read the public key from a file
    const publicKey: string = fs.readFileSync(
      path.join(homedir(), "jwtRS256.key.pub"),
      "utf-8"
    );
    // Define the options for the JWT verification
    const optionsN: jwt.VerifyOptions = {
      algorithms: ["RS256"] as Algorithm[],
    };

    // Decode the JWT using the public key
    const decoded = jwt.verify(token, publicKey, optionsN);
    const userId = (decoded as UserType)._id;

    // Check the user id is present or not in the database
    const isUserPresent = await user.isUserPresent(userId as Types.ObjectId);
    if (!isUserPresent){
      throw new RiseError(401, "Not Authorized");
    }

    // Return the user id
    return userId as string;
  }
}

const tokejwten = new TokenJWT();

export default tokejwten;
