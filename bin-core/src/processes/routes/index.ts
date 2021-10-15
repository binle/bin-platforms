/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import path from 'path';
import {
  ExErrorRequestHandler,
  ExNextFunction,
  Express,
  ExRequest,
  ExRequestHandler,
  ExResponse,
  HttpStatusCodes,
  IBinHttpError,
  MethodPathApi,
  newHttpError,
  TypeDataHandler,
  TypeGetFailedSchema,
  TypeGetSuccessSchema,
} from 'src/definitions';
import { ControllerRoute } from './controller.route';
import { DocumentRouter } from './document.router';

export const getDefaultErrorHandler = (
  logger?: any,
  exitOtherHandlerError?: boolean
): ExErrorRequestHandler => {
  return (error: IBinHttpError, _req: ExRequest, res: ExResponse, next: ExNextFunction): void => {
    typeof logger?.error === 'function' &&
      logger?.error('bin-express handle error ================ ', error);
    if (exitOtherHandlerError) {
      next(error);
    } else {
      const status = error.status || 500;
      const message = status < 500 ? error.message : 'Internal Server Error';
      const code = error.code;
      res.status(status).json({ error: { status, code, message } });
    }
  };
};

export const getDefaultDataHandler = (): TypeDataHandler => {
  return (data: any, res: ExResponse) => {
    res.send({ data });
  };
};

export const routeApp = (
  app: Express,
  options?: {
    prefix?: string;
    docPath?: string;
    logger?: any;
    dataHandlerOptions?: {
      dataHandler: TypeDataHandler;
      getSuccessSchema?: TypeGetSuccessSchema;
    };
    notFoundHandle?: ExRequestHandler;
    errorHandlerOptions?: {
      errorHandler: ExErrorRequestHandler;
      getFailedSchema?: TypeGetFailedSchema;
    };
  }
): MethodPathApi => {
  const dataHandler = options?.dataHandlerOptions?.dataHandler || getDefaultDataHandler();

  const existedApis = ControllerRoute.defineController(app, dataHandler, options?.prefix);
  if (options?.docPath) {
    DocumentRouter.routeDocumentAPI(app, options.docPath, existedApis, {
      getSuccessSchema: options?.dataHandlerOptions?.getSuccessSchema,
      getFailedSchema: options?.errorHandlerOptions?.getFailedSchema,
    });
  }

  let notFoundHandle = options?.notFoundHandle;
  if (!notFoundHandle) {
    notFoundHandle = () => {
      throw newHttpError(HttpStatusCodes.NOT_FOUND);
    };
  }
  const defaultErrorHandler =
    options?.errorHandlerOptions?.errorHandler ||
    getDefaultErrorHandler(options?.logger || console);
  app.use(path.join('/', options?.prefix || '', '*'), notFoundHandle);
  app.use(defaultErrorHandler);

  return existedApis;
};
