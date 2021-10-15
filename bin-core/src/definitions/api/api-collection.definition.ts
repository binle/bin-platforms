/* eslint-disable @typescript-eslint/ban-types */

import { ISchemaCore, IBinHttpError, IObjectSchema } from '../core';

export type ObjectType = unknown | Function | [Function] | string | Record<string, any>;

export type ApiRequestData = { [key: string]: ISchemaCore };

export type ApiResponseDataSuccess = { data?: ISchemaCore; description?: string };
export type ApiResponseDataFailed = { error?: IBinHttpError; description?: string };
export type ApiResponseData = {
  success?: ApiResponseDataSuccess;
  failed?: { [key: number]: ApiResponseDataFailed };
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

export const getDefaultFailedSchema: TypeGetFailedSchema = (
  error?: IBinHttpError,
  description?: string
) => ({
  type: 'object',
  description: description || `Request failed with status ${error?.status}`,
  properties: {
    error: {
      type: 'object',
      description: error
        ? JSON.stringify({
            status: error?.status,
            message: error?.message,
            code: error?.code,
          })
        : '',
    } as IObjectSchema,
  },
});
