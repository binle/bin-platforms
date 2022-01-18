/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IApiControllerInjectedData,
  IContainer,
  Identifier,
  TypeConstructor,
} from 'src/definitions';
import { Injectable, InjectToProperty } from './../core';

// =====================================================================================================================
class BinExpressContainer implements IContainer<any> {
  private map: Map<Identifier, any> = new Map<Identifier, any>();

  bind(key: Identifier, instance: any): void {
    if (this.map.get(key)) {
      throw new Error(`${key as string} is already bind.`);
    }
    this.map.set(key, instance);
  }
  unbind(key: Identifier): void {
    this.map.delete(key);
  }
  get(key: Identifier): any {
    return this.map.get(key);
  }
  getKeys(): Identifier[] {
    return Array.from<Identifier>(this.map.keys());
  }
}
export const controllerContainer: BinExpressContainer = new BinExpressContainer();

export const ApiController = (
  option: IApiControllerInjectedData
): ((target: TypeConstructor) => void) => Injectable(option, controllerContainer);
// =====================================================================================================================

// =====================================================================================================================
export const Service = (option: Identifier): ((target: TypeConstructor<any>) => void) =>
  Injectable(option);
export const InjectService = (option: Identifier): PropertyDecorator => InjectToProperty(option);

export * from './api-data-property.decorator';
export * from './api-middleware';
export * from './api-request-params.decorator';
export * from './api-request.decorator';
export * from './api-response.decorator';
