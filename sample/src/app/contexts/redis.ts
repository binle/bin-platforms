/* eslint-disable @typescript-eslint/no-explicit-any */
import Redis from 'redis';
import { IRedisGlobal } from 'src/definitions';

export const createRedis = (option: { host: string; port: number }): IRedisGlobal => {
  if (!option || !option.host || !option.port) {
    throw new Error('Redis required server configuration!');
  }
  const redisClient = Redis.createClient();

  const asyncGet = <T extends any>(key: string): Promise<T | undefined> => {
    return new Promise<T | undefined>((resolve, reject) =>
      redisClient.get(key, (error, data) =>
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
        ? redisClient.set(key, stringData, 'EX', expiredTime * 1000, cb)
        : redisClient.set(key, stringData, cb);
    });
  };

  const asyncDelete = (key: string): Promise<void> => {
    return new Promise((resolve, reject) => redisClient.del(key, (error) => (error ? reject(error) : resolve())));
  };

  const redis: IRedisGlobal = {
    redisClient,
    asyncGet: asyncGetWithDeleteOption,
    asyncSet,
    asyncDelete,
  };

  return redis;
};
