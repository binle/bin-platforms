/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ApiRequestParamInjectedData,
  ApiRequestParamKey,
  ISchemaGeneral,
  IObjectSchema,
} from 'src/definitions';
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
  MethodParams({
    from: 'body',
    schema: { ...schema, validation: { ...schema?.validation, isRequired: true } },
  });

export const BodyOptional = (schema?: ISchemaGeneral): ParameterDecorator =>
  MethodParams({ from: 'body', schema });

export const Headers = (schema?: IObjectSchema): ParameterDecorator =>
  MethodParams({
    from: 'headers',
    schema: { ...schema, type: 'object', validation: { ...schema?.validation, isRequired: true } },
  });

export const HeadersOptional = (schema?: IObjectSchema): ParameterDecorator =>
  MethodParams({ from: 'headers', schema: { ...schema, type: 'object' } });

export const Params = (schema?: IObjectSchema): ParameterDecorator =>
  MethodParams({
    from: 'params',
    schema: { ...schema, type: 'object', validation: { ...schema?.validation, isRequired: true } },
  });
export const ParamsOptional = (schema?: IObjectSchema): ParameterDecorator =>
  MethodParams({ from: 'params', schema: { ...schema, type: 'object' } });

export const Queries = (schema?: IObjectSchema): ParameterDecorator =>
  MethodParams({
    from: 'query',
    schema: { ...schema, type: 'object', validation: { ...schema?.validation, isRequired: true } },
  });
export const QueriesOptional = (schema?: IObjectSchema): ParameterDecorator =>
  MethodParams({ from: 'query', schema: { ...schema, type: 'object' } });

// =====================================================================================================================
export const getAllInjectedDataOfParamsInApi = (
  instance: any,
  methodName: string
): { [key: number]: ApiRequestParamInjectedData } =>
  getAllInjectedDataOfDecoratedMethodParams(instance, methodName, ApiRequestParamKey);

export const getAllTypeConstructorOfAllParamsInApi = (instance: any, methodName: string) =>
  getAllTypeConstructorOfAllParamsInMethod(instance, methodName);
// =====================================================================================================================
