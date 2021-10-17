import { LoggerOptions } from '@bachle/bin-logger';
import { RedisClient } from 'redis';

export interface IRedisGlobal {
  getRedisClient: () => RedisClient;
  asyncGet<T extends unknown>(key: string, deleteAfterGet?: boolean): Promise<T | undefined>;

  asyncSet<T extends unknown>(key: string, data: T, expiredTime?: number): Promise<void>;
  asyncDelete(key: string): Promise<void>;
}

export interface IDatabaseConfigOptions {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export interface IConfigGlobal {
  host: string;
  port: string | number;
  allowed_origin_urls: string[];
  client_path: string;
  client_configs: {
    domain?: string;
  };
  log_config: LoggerOptions;
  database_config: IDatabaseConfigOptions;
  redis_config: {
    host: string;
    port: number;
  };
}
