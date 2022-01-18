/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ApiResponseKey,
  IApiResponseInjectedData,
  IBinError,
  Identifier,
  ISchemaCore,
  IObjectSchema,
  IArraySchema,
  TypeProcessInjectedMethod,
} from 'src/definitions';
import { createMethodDecorator, getInjectedDataOfDecoratedMethod } from './../core';

// =====================================================================================================================
// =====================================================================================================================

export function getProcessApiResponseDecorator(
  metadataMethodKey: Identifier
): TypeProcessInjectedMethod<IApiResponseInjectedData> {
  return (
    target: any,
    methodName: Identifier,
    descriptor: TypedPropertyDescriptor<any>,
    injectedData?: IApiResponseInjectedData
  ): TypedPropertyDescriptor<any> | void => {
    if (typeof target[methodName] !== 'function') {
      throw new Error(`Can not process injected method for un-method ${methodName.toString()}!`);
    }
    const listInjectedData: IApiResponseInjectedData[] =
      Reflect.getMetadata(metadataMethodKey, target, methodName) || [];
    for (const item of listInjectedData) {
      if (item.dataSchema && injectedData?.dataSchema) {
        // eslint-disable-next-line quotes
        throw new Error(`There are more than one data schema of API's response!`);
      }
    }
    listInjectedData.push({ ...injectedData });
    Reflect.defineMetadata(metadataMethodKey, listInjectedData, target, methodName);
    return descriptor;
  };
}

export const ApiResponse = createMethodDecorator<IApiResponseInjectedData>(
  ApiResponseKey,
  getProcessApiResponseDecorator
);
export const ApiResponseSuccess = (
  dataSchema: ISchemaCore,
  description?: string
): MethodDecorator => ApiResponse({ dataSchema, description });

export const ApiResponseSuccessObject = (
  dataSchema: IObjectSchema,
  description?: string
): MethodDecorator => ApiResponse({ dataSchema: { ...dataSchema, type: 'object' }, description });

export const ApiResponseSuccessArray = (
  dataSchema: IArraySchema,
  description?: string
): MethodDecorator => ApiResponse({ dataSchema: { ...dataSchema, type: 'array' }, description });

export const ApiResponseError = (
  error: IBinError | IBinError[],
  description?: string
): MethodDecorator => ApiResponse({ error, description });
// =====================================================================================================================
export const getInjectedDataOfApiResponse = (
  instanceController: any,
  methodName: string
): IApiResponseInjectedData[] =>
  getInjectedDataOfDecoratedMethod(instanceController, methodName, ApiResponseKey);
// =====================================================================================================================
