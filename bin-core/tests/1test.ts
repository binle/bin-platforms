/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ISchemaCore, Identifier, createMethodDecorator, createPropertyTypeDecorator } from './../src';

export const ApiRequestKey = Symbol('ApiRequestKey');
export type ControllerMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all';

type ApiRequestInjectedData = {
  type: ControllerMethod;
  path: string;
};
export const Method = createMethodDecorator<ApiRequestInjectedData>(ApiRequestKey);

export const ApiObjectPropertyKey = Symbol('ApiObjectPropertyKey');

export const mapSchema: any = {};

type ApiRequestParameterFromType = 'request' | 'response' | 'body' | 'headers' | 'params' | 'query';

const ApiObjectPropertyProcess = createPropertyTypeDecorator<ApiRequestParameterFromType, ISchemaCore>(
  ApiObjectPropertyKey,
  mapSchema
);

export const DataProperty = (option: ISchemaCore): PropertyDecorator => ApiObjectPropertyProcess(option);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDataProperty = (target: any, propertyKey: Identifier): any => {
  return Reflect.getMetadata(ApiObjectPropertyKey, target, propertyKey);
};
