/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApiBeforeProcessRequestKey,
  ExRequestHandler,
  IApiBeforeInjectedData,
  Identifier,
  TypeGetRequestHandle,
  TypeProcessInjectedMethod,
} from 'src/definitions';
import { getDecoratorMethod } from './../../core';

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================
// Before
function getProcessApiBeforeInjectedMethod<T>(
  metadataMethodKey: Identifier
): TypeProcessInjectedMethod<T> {
  return (
    target: any,
    propertyKey: Identifier,
    descriptor: TypedPropertyDescriptor<any>,
    requestHandle?: T
  ): TypedPropertyDescriptor<any> | void => {
    const listInjectedData = Reflect.getMetadata(metadataMethodKey, target, propertyKey) || [];
    listInjectedData.push({ requestHandle });
    Reflect.defineMetadata(metadataMethodKey, listInjectedData, target, propertyKey);
    return descriptor;
  };
}
export const ApiBefore = getDecoratorMethod<ExRequestHandler>(
  getProcessApiBeforeInjectedMethod<ExRequestHandler>(ApiBeforeProcessRequestKey)
);

function getProcessApiBeforeInjectedMethodWidthFunctionCustomization(
  metadataMethodKey: Identifier
): TypeProcessInjectedMethod<TypeGetRequestHandle> {
  return (
    target: any,
    propertyKey: Identifier,
    descriptor: TypedPropertyDescriptor<any>,
    getRequestHandle?: TypeGetRequestHandle
  ): TypedPropertyDescriptor<any> | void => {
    const listInjectedData: IApiBeforeInjectedData[] =
      Reflect.getMetadata(metadataMethodKey, target, propertyKey) || [];
    listInjectedData.push({ getRequestHandle, type: 'MiddlewareBeforeCustom' });
    Reflect.defineMetadata(metadataMethodKey, listInjectedData, target, propertyKey);
    return descriptor;
  };
}

export const ApiBeforeCustom = getDecoratorMethod(
  getProcessApiBeforeInjectedMethodWidthFunctionCustomization(ApiBeforeProcessRequestKey)
);
// =====================================================================================================================
// common
const mapBeforeRequestHandler = (item: {
  requestHandle: ExRequestHandler;
  getRequestHandle: () => ExRequestHandler;
  type: string;
}): ExRequestHandler =>
  item.type === 'MiddlewareBeforeCustom' ? item.getRequestHandle() : item.requestHandle;

export const getAllMiddlewareBeforeRequestHandler = (
  instance: any,
  methodName: string
): ExRequestHandler[] => {
  const listInjectedData = Reflect.getMetadata(ApiBeforeProcessRequestKey, instance, methodName);
  const requestHandlers: ExRequestHandler[] = (listInjectedData || []).map(mapBeforeRequestHandler);
  return requestHandlers;
};

// =====================================================================================================================
// =====================================================================================================================
// =====================================================================================================================
