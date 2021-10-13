import { newHttpError } from '@bachle/bin-core';
import { createLogger } from '@bachle/bin-logger';
import axios, { AxiosResponse } from 'axios';
import { loadConfig } from './configs';
import { createDatabase } from './database';
import { createRedis } from './redis';

export const initialization = async (): Promise<void> => {
  const configs = loadConfig();
  const logger = createLogger(configs.log_config);
  const redis = createRedis(configs.redis_config);
  const database = createDatabase({ options: configs.database_config, logger });
  global.applicationContexts = {
    configs,
    logger,
    database,
    redis,
    rootPath: '',
  };

  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any) => {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.response?.data?.Message ||
        error.message;
      const code = error.response?.data?.error?.code || error.response?.data?.code || error.response?.data?.Code;
      const status = error.response?.status || 500;
      const httpError = newHttpError({ message, status }, { code, message });
      throw httpError;
    }
  );
};
