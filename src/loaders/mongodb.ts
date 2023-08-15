import mongoose, { Connection } from "mongoose";
import configs from "../configs";

export default async (): Promise<Connection> => {
  await mongoose.connect(configs.mongoDB)? console.log("Connected to MongoDB") : console.log("Failed connect to MongoDB");

  const db = mongoose.connection;

  // Listen for events
  db.on("error", (error) => {
    console.log("Error ocurred: ", error);
  });

  db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });

  return db;
};
