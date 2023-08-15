import { Request } from "express"

export default (req: Request) : string => {
	let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

	return req.cookies.token || token;
}
