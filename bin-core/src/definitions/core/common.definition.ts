/* eslint-disable @typescript-eslint/ban-types */

export interface IContainer<ID extends any = any> {
  bind<T>(name: ID, instance: T): void;
  unbind(name: ID): void;
  get<T>(name: ID): T;
}

export type TypeObject = unknown | Function | [Function] | string | Record<string, any>;

export interface TypeConstructor<T = any> extends Function {
  new (...args: any[]): T;
}

export type Identifier = string | symbol;
export interface IdentifyOption {
  name: Identifier;
}

export type TypeProcessInjectedClass<T, K, I = unknown> = (
  target: TypeConstructor<T>,
  injectedData: K,
  container?: IContainer<I>
) => void;

export type TypeProcessInjectedProperty<T, I = unknown> = (
  target: any,
  propertyKey: Identifier,
  injectedData?: T,
  container?: IContainer<I>
) => void;

export type TypeProcessInjectedPropertyRequireInjectData<T, I = unknown> = (
  target: any,
  propertyKey: Identifier,
  injectedData: T,
  container?: IContainer<I>
) => void;

export type TypeProcessInjectedMethod<T> = (
  target: any,
  propertyKey: Identifier,
  descriptor: TypedPropertyDescriptor<any>,
  injectedData?: T
) => TypedPropertyDescriptor<any> | void;

export type TypeProcessInjectedMethodParams<T> = (
  target: any,
  propertyKey: Identifier,
  paramIndex: number,
  injectedData?: T
) => void;
