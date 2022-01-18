/* eslint-disable @typescript-eslint/ban-types */

import {
  IBinError,
  IBinHttpError,
  INumberSchema,
  IObjectSchema,
  ISchemaCore,
  IStringSchema,
  NumberSchema,
  StringSchema,
} from '../core';

export type ObjectType = unknown | Function | [Function] | string | Record<string, any>;

export type ApiRequestData = { [key: string]: ISchemaCore };

export type ApiResponseDataSuccess = { data?: ISchemaCore; description?: string };
export type ApiResponseDataFailed = { error?: IBinError | IBinError[] };
export type ApiResponseData = {
  success?: ApiResponseDataSuccess;
  failed?: ApiResponseDataFailed[];
};

export type MethodPathApi = {
  [path: string]: {
    [method: string]: {
      description?: string;
      request: ApiRequestData;
      response: ApiResponseData;
    };
  };
};

export type TypeGetSuccessSchema<T = ApiResponseDataSuccess> = (response?: T) => IObjectSchema<T>;

export const getDefaultSuccessSchema: TypeGetSuccessSchema = (
  response?: ApiResponseDataSuccess
): IObjectSchema<ApiResponseDataSuccess> => ({
  type: 'object',
  description: response?.description || 'Response in success case:',
  properties: {
    data: response?.data || ({ type: undefined } as ISchemaCore),
  },
});

export type TypeGetFailedSchema<T = ApiResponseDataFailed> = (
  error?: IBinHttpError,
  description?: string
) => IObjectSchema<T>;

export const getDefaultFailedSchema: TypeGetFailedSchema = () => ({
  type: 'object',
  description: 'Request failed :',
  properties: {
    error: {
      type: 'object',
      properties: {
        status: { ...NumberSchema, validation: { isRequired: true } } as INumberSchema,
        message: { ...StringSchema, validation: { isRequired: true } } as IStringSchema,
        code: StringSchema,
      } as IObjectSchema<IBinHttpError>,
    } as IObjectSchema,
  },
});
