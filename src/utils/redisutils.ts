import { createClient, RedisClientType } from 'redis';
import configs from "../configs"

/**
 * A Redis client class that can be used to interact with Redis.
 */
class RedisClient {
  client: RedisClientType;
  constructor() {
    this.client = createClient({ url:configs.redisDB });
  }

  /**
   * Determines if the client is alive by pinging it.
   *
   * @return {boolean} Returns true if the client is alive, false otherwise.
   */
  async isAlive() : Promise<boolean>{
    await this.client.connect();
    const ping = await this.client.ping();
    if (ping === 'PONG') {
      await this.client.quit();
      return true;
    }
    await this.client.quit();
    return false;
  }

  /**
   * get a key in Redis with an expiration time.
   * @param {string} key The key to set.
   * @return {boolean} Returns true if the key was set, false otherwise.
   */
  async get(key: string) : Promise<string | null> {
    await this.client.connect();
    const value = await this.client.get(key);
    await this.client.quit();
    return value;
  }

  /**
   * get a key in Redis with an expiration time.
   * @param {string} key The key to set.
   * @param {string} value The value to set.
   * @param {number} duration The expiration time in seconds.
   */
  async set(key: string, value: string, duration: number): Promise<void> {
    await this.client.connect();
    await this.client.setEx(key, duration, value);
    await this.client.quit();
  }

  /**
   * del a key in Redis with an expiration time.
   * @param {string} key The key to delete.
   */
  async del(key: string): Promise<number> {
    await this.client.connect();
    const value = await this.client.del(key);
    await this.client.quit();
    return value;
  }
}

const redisClient = new RedisClient();

export default redisClient;
