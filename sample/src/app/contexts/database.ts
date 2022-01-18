import { ILogger } from '@bachle/bin-logger';
import { Knex, knex } from 'knex';
import { types } from 'pg';
import { IDatabaseConfigOptions } from 'src/definitions';
import { camelCase } from 'lodash';

export const createDatabase = (dbOptions: {
  options: IDatabaseConfigOptions;
  maxPools?: number;
  logger: ILogger;
}): Knex => {
  // disable auto converting to Date object
  const TIMESTAMPTZ_OID = 1184;
  const TIMESTAMP_OID = 1114;
  const INT8_TYPE = 20;
  const NUMERIC_TYPE = 1700;
  types.setTypeParser(TIMESTAMP_OID, (value) => {
    return new Date(value).toISOString();
  });
  types.setTypeParser(TIMESTAMPTZ_OID, (value) => {
    return new Date(value).toISOString();
  });
  types.setTypeParser(INT8_TYPE, (val) => {
    return parseInt(val, 0);
  });
  types.setTypeParser(NUMERIC_TYPE, (val) => {
    return parseFloat(val);
  });

  const knexInstance = knex({
    client: 'pg',
    connection: dbOptions.options,
    pool: { min: 0, max: dbOptions.maxPools || 7 },
    postProcessResponse: (result) => {
      if (Array.isArray(result)) {
        return result.map((row) => camelCase(row));
      } else {
        return camelCase(result);
      }
    },
    wrapIdentifier: (value, origImpl) => origImpl(camelCase(value)),
  });

  return knexInstance;
};
