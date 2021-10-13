import path from 'path';
import {
  TypeApiRequestMethod,
  Express,
  ExRequestHandlerParams,
  MethodPathApi,
  IApiControllerInjectedData,
} from 'src/definitions';
import {
  controllerContainer,
  getAllApiRequestsInController,
  getAllMiddlewareBeforeRequestHandler,
  getInjectedDataOfApiRequest,
  getMiddlewareErrorRequestHandler,
} from './../api';
import { MethodRoute } from './method.route';

export class ControllerRoute {
  static defineController(app: Express, prefix?: string): MethodPathApi {
    const existedApis: MethodPathApi = {};

    for (const key of controllerContainer.getKeys()) {
      const controllerInstance: any = controllerContainer.get(key);
      const controllerInjectedData: IApiControllerInjectedData = controllerInstance.injectedData;
      const allApiRequests = getAllApiRequestsInController(controllerInstance);
      for (const methodName of allApiRequests) {
        const {
          path: methodPath,
          type: apiMethodType,
          description,
        } = getInjectedDataOfApiRequest(controllerInstance, methodName);
        const routePath = path.join('/', prefix || '', controllerInjectedData.path, methodPath);
        if (!apiMethodType || !routePath) {
          throw new Error(
            `Can not detect routing for function${methodName} with method:${apiMethodType} and path:${routePath}`
          );
        }
        const requestHandlers: ExRequestHandlerParams[] = getAllMiddlewareBeforeRequestHandler(
          controllerInstance,
          methodName
        );
        const definedApiData = MethodRoute.defineAPIs(controllerInstance, methodName);
        requestHandlers.push(definedApiData.requestHandler);
        const handlerError = getMiddlewareErrorRequestHandler(controllerInstance, methodName);
        handlerError && requestHandlers.push(handlerError);
        ControllerRoute.routeApi(app, apiMethodType, routePath, existedApis, ...requestHandlers);
        existedApis[routePath][apiMethodType].description = description;
        existedApis[routePath][apiMethodType].request = definedApiData.requestInfo;
        existedApis[routePath][apiMethodType].response = definedApiData.responseInfo;
      }
    }
    return existedApis;
  }

  static routeApi(
    app: Express,
    apiMethodType: TypeApiRequestMethod,
    path: string,
    existedApis: MethodPathApi,
    ...requestHandlers: ExRequestHandlerParams[]
  ): void {
    if (existedApis[path] && existedApis[path][apiMethodType]) {
      throw new Error(`The api path ${path} with method ${apiMethodType} is duplicated!`);
    }
    if (
      apiMethodType === 'all' &&
      (existedApis[path]['get'] ||
        existedApis[path]['post'] ||
        existedApis[path]['put'] ||
        existedApis[path]['patch'] ||
        existedApis[path]['delete'])
    ) {
      throw new Error(
        `The api path ${path} with method all can not set because exit detail method with same path!`
      );
    }
    let method: any;
    switch (apiMethodType) {
      case 'get': {
        method = app.get.bind(app);
        break;
      }
      case 'post': {
        method = app.post.bind(app);
        break;
      }
      case 'put': {
        method = app.put.bind(app);
        break;
      }
      case 'patch': {
        method = app.patch.bind(app);
        break;
      }
      case 'delete': {
        method = app.delete.bind(app);
        break;
      }
      case 'all': {
        method = app.use.bind(app);
        break;
      }
      default: {
        throw new Error(`Method type: ${apiMethodType} is not support! Pleas re-check.`);
      }
    }
    existedApis[path] = existedApis[path] || {};
    existedApis[path][apiMethodType] = { request: {}, response: {} };
    if (apiMethodType === 'all') {
      existedApis[path]['get'] =
        existedApis[path]['post'] =
        existedApis[path]['put'] =
        existedApis[path]['patch'] =
        existedApis[path]['delete'] =
          { request: {}, response: {} };
    }
    method(path, requestHandlers);
  }
}
