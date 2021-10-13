/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApiErrorAfterProcessRequestKey,
  ExErrorRequestHandler,
  Identifier,
  TypeProcessInjectedMethod,
} from 'src/definitions';
import { getDecoratorMethod } from '../../core';

// =====================================================================================================================
// =====================================================================================================================
// After
function getMiddlewareErrorProcessInjectedMethod<T>(
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

export const ApiError = getDecoratorMethod<ExErrorRequestHandler>(
  getMiddlewareErrorProcessInjectedMethod<ExErrorRequestHandler>(ApiErrorAfterProcessRequestKey)
);

export const getMiddlewareErrorRequestHandler = (
  instance: any,
  methodName: string
): ExErrorRequestHandler => {
  return Reflect.getMetadata(ApiErrorAfterProcessRequestKey, instance, methodName);
};
// =====================================================================================================================
