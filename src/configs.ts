import { config } from "dotenv";
config();

export default {
  env: <string>process.env.NODE_ENV,
  mongoDB: <string>process.env.MONGO_DB_REMOTE,
  redisDB:<string>process.env.REDIS_DB_URL,
  jwt: {
    rsa:{
      public_key:<string>process.env.PUBLIC_KEY,
      private_key:<string>process.env.PRIVATE_KEY
    },
    expires_in: <string>process.env.JWT_EXPIRES_IN,
  },
  uploadDir: <string>process.env.UPLOAD_DIR,
};
