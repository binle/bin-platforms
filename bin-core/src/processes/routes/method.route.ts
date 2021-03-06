/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { merge } from 'lodash';
import {
  ApiRequestData,
  ApiRequestParamInjectedData,
  ApiResponseData,
  ExNextFunction,
  ExRequest,
  ExRequestHandler,
  ExResponse,
  IArraySchema,
  ISchemaCore,
  TypeConstructor,
  ResponseDataHandler,
  TypeValidateFunctionInjectedData,
} from 'src/definitions';
import {
  getAllInjectedDataOfParamsInApi,
  getAllTypeConstructorOfAllParamsInApi,
  getInjectedDataOfApiResponse,
  getSchemaOfType,
  getValidationHandlerOfApiRequest,
} from './../api';
import { asyncValidate } from './../core';
import { MethodParamsRoute } from './method-params.route';

export class MethodRoute {
  static defineAPIs(
    controllerInstance: any,
    methodName: string,
    dataHandler: ResponseDataHandler,
    isCustomDataHandler?: boolean
  ): {
    responseInfo: ApiResponseData;
    requestInfo: ApiRequestData;
    requestHandler: ExRequestHandler;
  } {
    const paramsTypes = getAllTypeConstructorOfAllParamsInApi(controllerInstance, methodName);

    const allInjectedParamsInApi: { [key: number]: ApiRequestParamInjectedData } =
      getAllInjectedDataOfParamsInApi(controllerInstance, methodName) || {};

    if (Object.keys(allInjectedParamsInApi).length !== paramsTypes.length) {
      throw new Error(
        `${controllerInstance}.${methodName} has param which is not declared! ${
          Object.keys(allInjectedParamsInApi).length
        }/${paramsTypes.length} have been declared!`
      );
    }

    const requestInfo = MethodRoute.defineRequestInfo(allInjectedParamsInApi, paramsTypes);
    const responseInfo = MethodRoute.defineResponseInfo(
      controllerInstance,
      methodName,
      isCustomDataHandler
    );

    return {
      requestInfo,
      responseInfo,
      requestHandler: async (req: ExRequest, res: ExResponse, next: ExNextFunction) => {
        try {
          const methodParamValue: any[] = [];
          for (const index in allInjectedParamsInApi) {
            const definedValue = MethodParamsRoute.defineMethodParamValue(
              req,
              res,
              allInjectedParamsInApi[index]
            );
            if (definedValue.canValidate) {
              const paramSchema = MethodRoute.defineArraySchema(
                getSchemaOfType(paramsTypes[index])
              );
              const error = await asyncValidate(
                paramSchema,
                definedValue.value,
                `${allInjectedParamsInApi[index].from}`
              );
              if (error) {
                throw error;
              }
            }
            methodParamValue[index] = definedValue.value;
          }

          const validateMethod: TypeValidateFunctionInjectedData = getValidationHandlerOfApiRequest(
            controllerInstance,
            methodName
          );
          if (validateMethod) {
            if (typeof validateMethod === 'function') {
              let validateResult = validateMethod(...methodParamValue);
              if (validateResult && validateResult instanceof Promise) {
                validateResult = await validateResult;
              }
              if (validateResult) {
                throw validateResult;
              }
            } else {
              throw new Error('The validation is not function.');
            }
          }
          let result = controllerInstance[methodName](...methodParamValue);
          if (result instanceof Promise) {
            result = await result;
          }
          dataHandler(result, res);
        } catch (error) {
          next(error);
        }
      },
    };
  }

  private static defineRequestInfo(
    allInjectedParamsInApi: { [key: number]: ApiRequestParamInjectedData },
    paramsTypes: TypeConstructor[]
  ) {
    const requestInfo: ApiRequestData = {};
    for (const index in allInjectedParamsInApi) {
      const tempSchema = merge(
        {},
        allInjectedParamsInApi[index].schema,
        getSchemaOfType(paramsTypes[index]) as ISchemaCore
      );
      requestInfo[allInjectedParamsInApi[index].from] =
        MethodRoute.defineArraySchema(tempSchema) || {};
    }
    return requestInfo;
  }

  private static defineResponseInfo(
    controllerInstance: any,
    methodName: string,
    isCustomDataHandler?: boolean
  ) {
    const responseInjectedData = getInjectedDataOfApiResponse(controllerInstance, methodName) || [];

    const responseInfo: ApiResponseData = {};
    for (const injectedData of responseInjectedData) {
      if (injectedData.dataSchema) {
        const dataSchema = MethodRoute.defineArraySchema(injectedData.dataSchema as ISchemaCore);
        if (isCustomDataHandler) {
          responseInfo.success = dataSchema;
        } else {
          responseInfo.success = {
            data: dataSchema,
            description: injectedData.description,
          };
        }
      } else if (injectedData.error) {
        responseInfo.failed = responseInfo.failed || [];
        responseInfo.failed.push({
          error: injectedData.error,
        });
      }
    }
    return responseInfo;
  }

  private static defineArraySchema = (tempSchema: ISchemaCore | undefined) => {
    if (tempSchema?.type !== 'array') {
      return (
        (tempSchema?.propertyType &&
          merge({}, tempSchema, getSchemaOfType(tempSchema.propertyType))) ||
        tempSchema
      );
    } else if ((tempSchema as IArraySchema).itemSchema) {
      (tempSchema as IArraySchema).itemSchema = MethodRoute.defineArraySchema(
        (tempSchema as IArraySchema).itemSchema as ISchemaCore
      );
    }
    return tempSchema;
  };
}
