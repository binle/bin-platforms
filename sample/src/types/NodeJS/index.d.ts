import { ILogger } from '@bachle/bin-logger';
import { Knex } from 'knex';
import { IConfigGlobal, IRedisGlobal } from 'src/definitions';

declare global {
  namespace NodeJS {
    interface Global {
      applicationContexts: {
        configs: IConfigGlobal;
        redis: IRedisGlobal;
        database: Knex;
        logger: ILogger;
        rootPath: string;
      };
    }
  }
}
