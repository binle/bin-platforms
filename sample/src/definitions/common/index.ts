import { INumberSchema, IStringSchema } from '@bachle/bin-core';

export * from './context.definition';

export interface IDataError {
  message: string;
  code?: string;
}

export const StringRequireSchemaValidator: IStringSchema = { type: 'string', validation: { isRequired: true } };
export const NumberRequireSchemaValidator: INumberSchema = { type: 'number', validation: { isRequired: true } };

export const BinHttpErrorCodes = {
  invalid_cors: {
    code: 'invalid_cors',
    message: 'Not allowed by CORS!',
  },
  invalid_authorized_state: {
    code: 'invalid_authorized_state',
    // eslint-disable-next-line quotes
    message: "Your authorized account's state can not use this API!",
  },
};
