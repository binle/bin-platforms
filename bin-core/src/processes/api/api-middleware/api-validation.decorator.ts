/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApiValidationBeforeProcessRequestKey,
  TypeValidateFunctionInjectedData,
} from 'src/definitions';
import { createMethodDecorator, getInjectedDataOfDecoratedMethod } from './../../core';

// =====================================================================================================================
export const Validation = (validateFunction: TypeValidateFunctionInjectedData): MethodDecorator =>
  createMethodDecorator<TypeValidateFunctionInjectedData>(ApiValidationBeforeProcessRequestKey)(
    validateFunction
  );

export const getValidationHandlerOfApiRequest = (
  instance: any,
  methodName: string
): TypeValidateFunctionInjectedData =>
  getInjectedDataOfDecoratedMethod(instance, methodName, ApiValidationBeforeProcessRequestKey);

// =====================================================================================================================
// =====================================================================================================================
