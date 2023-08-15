import http from "http";
import app from "./app";
import db from "./mongodb";
import redisdb from "./redis"

export default async() => {
  const port = process.env.PORT || 8000;
  const server = http.createServer(app);

  // Connect to mongoDb
  const mongoDb = await db();

  // Connect to redis
  const redis = await redisdb();

  if (mongoDb && redis) {
    server.listen(port, () => {
      process.stdout.write(`Server started on port http://localhost:${port}\n`);
    });
  }

  // Majestic close
  process.on("SIGINT", () => {
    server.close();
    mongoDb.close();
  });
};
