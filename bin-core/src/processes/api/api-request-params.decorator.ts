/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiRequestParamInjectedData, ApiRequestParamKey, ISchemaGeneral } from 'src/definitions';
import {
  createMethodParamDecorator,
  getAllInjectedDataOfDecoratedMethodParams,
  getAllTypeConstructorOfAllParamsInMethod,
} from './../core';

// =====================================================================================================================
export const MethodParams =
  createMethodParamDecorator<ApiRequestParamInjectedData>(ApiRequestParamKey);

export const Req = (): ParameterDecorator => MethodParams({ from: 'request' });
export const Res = (): ParameterDecorator => MethodParams({ from: 'response' });

export const Body = (schema?: ISchemaGeneral): ParameterDecorator =>
  MethodParams({ from: 'body', schema });
export const Headers = (schema?: ISchemaGeneral): ParameterDecorator =>
  MethodParams({ from: 'headers', schema });
export const Params = (schema?: ISchemaGeneral): ParameterDecorator =>
  MethodParams({ from: 'params', schema });
export const Queries = (schema?: ISchemaGeneral): ParameterDecorator =>
  MethodParams({ from: 'query', schema });

// =====================================================================================================================
export const getAllInjectedDataOfParamsInApi = (
  instance: any,
  methodName: string
): { [key: number]: ApiRequestParamInjectedData } =>
  getAllInjectedDataOfDecoratedMethodParams(instance, methodName, ApiRequestParamKey);

export const getAllTypeConstructorOfAllParamsInApi = (instance: any, methodName: string) =>
  getAllTypeConstructorOfAllParamsInMethod(instance, methodName);
// =====================================================================================================================
