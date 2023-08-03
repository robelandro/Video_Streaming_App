import express from "express";
import path from "path";
import dotenv from "dotenv";
import map from "./router/index";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import checkAuth from "./midleware/authmidle";
import errorHandler from "./midleware/errormidle";
import isStorageAlive from "./util/helper/aliveCheck";

dotenv.config();
const PORT: number = Number(process.env.PORT) || 8000;
const HOST: string = process.env.HOST || "localhost";
const app: express.Application = express();

app.use(express.static(path.join(__dirname, "public"))); // to serve static files
app.use(cookieParser()); // to parse the cookies
app.use(express.json()); // to parse the body of the request
app.use(express.urlencoded({ extended: true })); // to parse the body of the request
app.use(helmet()); // use helmet to secure the app
app.use(checkAuth); // check if the user is authenticated

map(app); // map the routes

app.use(errorHandler); // handle all errors

isStorageAlive().then((value) => {
  if (value) {
    app.listen(PORT, () => {
      process.stdout.write(`Server running at http://${HOST}:${PORT}\n`);
    });
  }
}); // check if the server is connected to the DB and Redis
