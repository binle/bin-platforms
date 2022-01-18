import { merge } from 'lodash';
import { LoggerOptions } from '@bachle/bin-logger';

import fse from 'fs-extra';
import { IConfigGlobal, IDatabaseConfigOptions } from 'src/definitions';
import path from 'path';

const REQUIRED_STRING = 'REQUIRED_STRING';
const REQUIRED_NUMBER = 99999999;

class Config implements IConfigGlobal {
  host: string = REQUIRED_STRING;
  port: number | string = REQUIRED_STRING;
  allowed_origin_urls = [];
  client_path: string = REQUIRED_STRING;
  client_configs = {
    domain: '',
  };
  log_config: LoggerOptions = {
    level: 'debug',
    filename: 'server-account.log',
    folderPath: REQUIRED_STRING,
    maxNumberFile: 10,
    maxFileSize: 1048576,
  };
  database_config: IDatabaseConfigOptions = {
    user: REQUIRED_STRING,
    password: REQUIRED_STRING,
    database: REQUIRED_STRING,
    host: REQUIRED_STRING,
    port: REQUIRED_NUMBER,
  };
  redis_config = {
    host: REQUIRED_STRING,
    port: REQUIRED_NUMBER,
  };
}

const loadJsonFile = (path: string): Config => {
  return fse.readJSONSync(path) as Config;
};

export const loadConfig = (): IConfigGlobal => {
  let envConfig = {};

  envConfig = process.env.CONFIG_FILE_PATH
    ? loadJsonFile(process.env.CONFIG_FILE_PATH)
    : loadJsonFile(path.join(__dirname, './../../../env/local/local.config.json'));
  const configs: Config = merge(new Config(), envConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifyConfig = (obj: any, configPath?: string) => {
    for (const key in obj) {
      if (obj[key] instanceof Object) {
        verifyConfig(obj[key], `${configPath || 'configs'}.${key}`);
      } else if (obj[key] === REQUIRED_STRING || obj[key] === REQUIRED_NUMBER) {
        throw new Error(`Configuration for key "${configPath || 'configs'}.${key}" is missing`);
      }
    }
  };
  verifyConfig(configs);
  return configs;
};
