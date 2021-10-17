/* eslint-disable @typescript-eslint/no-explicit-any */
import Redis, { RedisClient } from 'redis';
import { IRedisGlobal } from 'src/definitions';

export const createRedis = (option: { host: string; port: number }): IRedisGlobal => {
  if (!option || !option.host || !option.port) {
    throw new Error('Redis required server configuration!');
  }

  let redisClient: RedisClient;

  const getRedisClient = () => {
    if (!redisClient) {
      redisClient = Redis.createClient(option);
    }
    return redisClient;
  };

  const asyncGet = <T extends any>(key: string): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve, reject) =>
      getRedisClient().get(key, (error, data) =>
        error ? reject(error) : resolve(data ? JSON.parse(data as string) : undefined)
      )
    );
  };

  const asyncGetWithDeleteOption = async <T extends any>(
    key: string,
    deleteAfterGet?: boolean
  ): Promise<T | undefined> => {
    const returnData = await asyncGet<T>(key);
    deleteAfterGet && (await asyncDelete(key));
    return returnData;
  };

  const asyncSet = <T extends any>(key: string, data: T, expiredTime?: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cb = (error: any) => (error ? reject(error) : resolve());
      const stringData = JSON.stringify(data);
      expiredTime
        ? getRedisClient().set(key, stringData, 'EX', expiredTime * 1000, cb)
        : getRedisClient().set(key, stringData, cb);
    });
  };

  const asyncDelete = (key: string): Promise<void> => {
    return new Promise((resolve, reject) => getRedisClient().del(key, (error) => (error ? reject(error) : resolve())));
  };

  const redis: IRedisGlobal = {
    getRedisClient,
    asyncGet: asyncGetWithDeleteOption,
    asyncSet,
    asyncDelete,
  };

  return redis;
};
