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

export const routeApp = (
  app: Express,
  options?: {
    prefix?: string;
    docPath?: string;
    logger?: any;
    notFoundHandle?: ExRequestHandler;
    defaultErrorHandler?: ExErrorRequestHandler;
  }
): MethodPathApi => {
  const existedApis = ControllerRoute.defineController(app, options?.prefix);
  if (options?.docPath) {
    DocumentRouter.routeDocumentAPI(app, options.docPath, existedApis);
  }

  let notFoundHandle = options?.notFoundHandle;
  if (!notFoundHandle) {
    notFoundHandle = () => {
      throw newHttpError(HttpStatusCodes.NOT_FOUND);
    };
  }
  const defaultErrorHandler =
    options?.defaultErrorHandler || getDefaultErrorHandler(options?.logger || console);
  app.use(path.join('/', options?.prefix || '', '*'), notFoundHandle);
  app.use(defaultErrorHandler);

  return existedApis;
};
