/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ApiRequestKey, IApiRequestInjectedData } from 'src/definitions';
import {
  createMethodDecorator,
  getAllDecoratedMethods,
  getInjectedDataOfDecoratedMethod,
} from './../core';

// =====================================================================================================================
// =====================================================================================================================

export const ApiRequest = createMethodDecorator<IApiRequestInjectedData>(ApiRequestKey);
export const Api = (option: IApiRequestInjectedData): MethodDecorator => ApiRequest(option);

export const Get = (path: string, description?: string): MethodDecorator =>
  ApiRequest({ type: 'get', path, description });
export const Post = (path: string, description?: string): MethodDecorator =>
  ApiRequest({ type: 'post', path, description });
export const Put = (path: string, description?: string): MethodDecorator =>
  ApiRequest({ type: 'put', path, description });
export const Path = (path: string, description?: string): MethodDecorator =>
  ApiRequest({ type: 'patch', path, description });
export const Delete = (path: string, description?: string): MethodDecorator =>
  ApiRequest({ type: 'delete', path, description });
// =====================================================================================================================
export const getAllApiRequestsInController = (instanceController: any): string[] =>
  getAllDecoratedMethods(instanceController, ApiRequestKey);

export const getInjectedDataOfApiRequest = (
  instanceController: any,
  methodName: string
): IApiRequestInjectedData =>
  getInjectedDataOfDecoratedMethod(instanceController, methodName, ApiRequestKey);
// =====================================================================================================================
