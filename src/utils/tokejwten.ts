import jwt, { Algorithm, JwtPayload } from "jsonwebtoken";
import AppError from "./apperror";
import configs from "../configs";

interface ExpectedPayload extends JwtPayload {
  id: string;
  userName: string;
}

/**
 * Function to generate a JWT token
 * @param payload must have the `_id` and `userName` as object properties
 * example of payload:
 * ```js
 * const payload = { _id: "123456789", userName: "John Doe"};
 * ```
 * @returns 
 */
export const generateToken = (payload: ExpectedPayload): string => {

  // Extract the _id and userName from the payload
  const { id, userName } = payload;

  // create a new payload with only the _id and userName
  payload = { id, userName };

  // Define the options for the JWT
  const options: jwt.SignOptions = {
    algorithm: "RS256" as Algorithm,
    expiresIn: Number(configs.jwt.expires_in),
  };
  // Encode the JWT using the private key
  const token = jwt.sign(payload, configs.jwt.rsa.private_key, options);
  return token as string;
}

/**
 * this function decode the token using the public key
 * @param token
 * @returns
 */
export const decodeToken = (token: string): ExpectedPayload => {
  // Define the options for the JWT verification
  const optionsN: jwt.VerifyOptions = {
    algorithms: ["RS256"] as Algorithm[],
  };
  // Decode the JWT using the public key
  const decoded = jwt.verify(token, configs.jwt.rsa.public_key, optionsN);
  // Check if the decoded token is valid
  if (!decoded) {
    throw new AppError("Invalid token", 401);
  }

  return decoded as ExpectedPayload;
}
