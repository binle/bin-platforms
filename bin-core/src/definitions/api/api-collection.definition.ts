/* eslint-disable @typescript-eslint/ban-types */

import { ISchemaCore, IBinHttpError } from '../core';

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
