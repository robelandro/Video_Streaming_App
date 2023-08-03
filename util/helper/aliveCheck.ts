import * as Db from "../db";
import redisClient from "../redis";

/**
 * check if the server is connected to the DB and Redis
 * @returns true if the server is connected to the DB and Redis
 */
const isStorageAlive = async():Promise<boolean> => {
  console.log("Trying To Connecet ...");
  const isAliveDb = await Db.isAlive();
  const isAliveRedis = await redisClient.isAlive();
  if (isAliveDb && isAliveRedis) {
    console.log("Connected To MongoDB and Redis");
    return true;
  } else {
    console.log("Failed To Connect To DB");
    process.exit(1);
  }
};

export default isStorageAlive;
