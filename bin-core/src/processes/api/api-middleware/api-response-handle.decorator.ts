/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApiResponseHandleProcessRequestKey,
  Identifier,
  ResponseDataHandler,
  TypeProcessInjectedMethod,
} from 'src/definitions';
import { getDecoratorMethod } from '../../core';

// =====================================================================================================================
// =====================================================================================================================
// After
function getResponseHandlerProcessInjectedMethod<T>(
  metadataMethodKey: Identifier
): TypeProcessInjectedMethod<T> {
  return (
    target: any,
    propertyKey: Identifier,
    descriptor: TypedPropertyDescriptor<any>,
    requestHandle?: T
  ): TypedPropertyDescriptor<any> | void => {
    Reflect.defineMetadata(metadataMethodKey, requestHandle, target, propertyKey);
    return descriptor;
  };
}

export const ApiResponseHandle = getDecoratorMethod<ResponseDataHandler>(
  getResponseHandlerProcessInjectedMethod<ResponseDataHandler>(ApiResponseHandleProcessRequestKey)
);

export const getResponseHandleRequestHandler = (
  instance: any,
  methodName: string
): ResponseDataHandler => {
  return Reflect.getMetadata(ApiResponseHandleProcessRequestKey, instance, methodName);
};
// =====================================================================================================================
