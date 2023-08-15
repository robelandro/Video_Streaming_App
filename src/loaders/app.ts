import express, { Response, Request, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import errorHandler from "../utils/geh";
import AppError from "../utils/apperror";

const app: express.Application = express();
const apiName = "/api/v1.1" // api Name with Version

// thrid party middleware
app.use(helmet()); // use helmet to secure the app
app.use(cookieParser()); // to parse the cookies

// builtin middleware
const appDir = path.dirname(require.main?.filename || "");
app.use(express.static(path.join(appDir, "public"), {dotfiles: 'ignore',})); // to serve static files
app.use(express.json()); // to parse the body of the request
app.use(express.urlencoded({ extended: true })); // to parse the body of the request

// importing router
import usersRouter from "../api/users/router"
import videoRouter from "../api/videos/router"
import webRouter from "../api/web/router"

app.use('/', webRouter)
app.use(`${apiName}/users`, usersRouter);
app.use(`${apiName}/videos`, videoRouter);

// unknown route handler
app.use('*', (req: Request, res: Response, next: NextFunction) => {
	return next(new AppError("Unknown URL", 404));
  });

app.use(errorHandler);

export default app;
