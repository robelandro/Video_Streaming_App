import express from "express";
import path from "path";
import dotenv from "dotenv";
import map from "./router/index";
import * as Db from "./util/db";
import redisClient from "./util/redis";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import checkAuth from "./midleware/authmidle";

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
/**
 * This function is used to check if the server is connected to the DB and Redis
 */
async function main(): Promise<void> {
  console.log("Trying To Connecet ...");
  const isAliveDb = await Db.isAlive();
  const isAliveRedis = await redisClient.isAlive();

  // if the server is connected to the DB and Redis, start the server
  if (isAliveDb && isAliveRedis) {
    console.log("Connected To MongoDB and Redis");
    app.listen(PORT, () => {
      process.stdout.write(`Server running at http://${HOST}:${PORT}\n`);
    });
  } else {
    console.log("Failed To Connect To DB");
    process.exit(1);
  }
}

// Start the server
main().catch((err) => console.log(err));
