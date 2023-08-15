import { RedisClientType } from 'redis';
import redisClient from "../utils/redisutils";

export default async(): Promise<RedisClientType> => {
	const client : RedisClientType = redisClient.client;
	client.connect().then(() => {
		console.log("Connected to RedisDB");
	  })
	  .catch((error) => {
		console.log("Failed to connect to RedisDB: ", error);
		process.exit(0);
	  });
	client.on('error', err => console.log('Redis Client Error', err));
	await client.quit();
	return client;
}
