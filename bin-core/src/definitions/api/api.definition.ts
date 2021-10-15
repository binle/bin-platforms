import multer from 'multer';
import {
  ExRequestHandler,
  IArraySchema,
  IBinError,
  IdentifyOption,
  IEnumSchema,
  IFileSchema,
  ISchemaCore,
  IValidationError,
  ISchemaGeneral,
} from '../core';

//=====================================================================================
export interface IApiControllerInjectedData extends IdentifyOption {
  path: string;
  description?: string;
}

//=====================================================================================
export type TypeApiRequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all';
export const AllApiRequestMethods: TypeApiRequestMethod[] = [
  'all',
  'delete',
  'get',
  'patch',
  'post',
  'put',
];
export interface IApiRequestInjectedData {
  type: TypeApiRequestMethod;
  path: string;
  description?: string;
}
export const ApiRequestKey = Symbol('ApiRequestKey');

//=====================================================================================
type TypeApiRequestParameterFrom = 'request' | 'response' | 'body' | 'headers' | 'params' | 'query';
export type ApiRequestParamInjectedData = {
  from: TypeApiRequestParameterFrom | string;
  schema?: ISchemaCore;
};
export const ApiRequestParamKey = Symbol('ApiRequestParamKey');

//=====================================================================================
export interface IApiResponseInjectedData {
  description?: string;
  dataSchema?: ISchemaCore;
  error?: IBinError | IBinError[];
}
export const ApiResponseKey = Symbol('ApiResponseKey');

//=====================================================================================
type TypeExtraApiPropertyInjectedData<T = any> = {
  sample?: T;
  description?: string;
};

export type IApiPropertyInjectedData<T = any> = TypeExtraApiPropertyInjectedData<T> &
  ISchemaGeneral;
export const ApiPropertyKey = Symbol('ApiPropertyKey');
export const CONSTRUCTOR_SCHEMA_KEY = 'CONSTRUCTOR_SCHEMA_KEY';

export type IEnumPropertyInjectedData = TypeExtraApiPropertyInjectedData & IEnumSchema;
export type IArrayPropertyInjectedData = TypeExtraApiPropertyInjectedData & IArraySchema;
export type IFilePropertyInjectedData = TypeExtraApiPropertyInjectedData & IFileSchema;

//=====================================================================================
export interface IMulterFileOption {
  name: string;
}
export interface IMulterMultiFileOption extends IMulterFileOption {
  maxCount?: number;
}

export interface IApiMulterInjectedData {
  single?: IMulterFileOption;
  array?: IMulterMultiFileOption;
  fields?: IMulterMultiFileOption[];
  options?: multer.Options;
}

//=====================================================================================
export type TypeGetRequestHandle = () => ExRequestHandler;
export interface IApiBeforeInjectedData {
  type?: string;
  requestHandle?: ExRequestHandler;
  getRequestHandle?: TypeGetRequestHandle;
}
export const ApiBeforeProcessRequestKey = Symbol('ApiBeforeProcessRequestKey');
export const ApiErrorAfterProcessRequestKey = Symbol('ApiErrorAfterProcessRequestKey');

//=====================================================================================
export type TypeValidateFunctionInjectedData = (
  ...args: any[]
) => (IValidationError | undefined) | Promise<IValidationError | undefined>;
export const ApiValidationBeforeProcessRequestKey = Symbol('ApiValidationBeforeProcessRequestKey');

//=====================================================================================
//=====================================================================================
