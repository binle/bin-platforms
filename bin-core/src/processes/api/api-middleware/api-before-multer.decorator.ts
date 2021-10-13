import multer from 'multer';
import {
  ApiBeforeProcessRequestKey,
  ExNextFunction,
  ExRequest,
  ExRequestHandler,
  ExResponse,
  IApiBeforeInjectedData,
  IApiMulterInjectedData,
  Identifier,
  IMulterFileOption,
  TypeProcessInjectedMethod,
} from 'src/definitions';
import { getDecoratorMethod } from './../../core';

// =====================================================================================================================
function getProcessApiBeforeMulterDecorator(
  metadataMethodKey: Identifier
): TypeProcessInjectedMethod<IApiMulterInjectedData> {
  return (
    target: any,
    propertyKey: Identifier,
    descriptor: TypedPropertyDescriptor<any>,
    injectedData?: IApiMulterInjectedData
  ): TypedPropertyDescriptor<any> | void => {
    if (!injectedData) {
      throw new Error('Can not setting multer!');
    }
    let count = 0;
    count += injectedData.single ? 1 : 0;
    count += injectedData.array ? 1 : 0;
    count += injectedData.fields ? 1 : 0;
    if (count === 0 || count > 1) {
      throw new Error(
        'There is only one of [single, array, fields] which have to be passed value!'
      );
    }

    const multerInstance = multer(injectedData.options);
    let multerHandler: ExRequestHandler;
    const multerProcessHandler: ExRequestHandler = async (
      request: ExRequest,
      _res: ExResponse,
      next: ExNextFunction
    ) => {
      if (injectedData.single) {
        request.body[injectedData.single.name] = request.file;
      } else if (injectedData.array) {
        request.body[injectedData.array.name] = request.files;
      } else if (injectedData.fields) {
        for (const item of injectedData.fields) {
          request.body[item.name] = (request.files as any)[item.name];
        }
      }
      next();
    };
    if (injectedData.single) {
      multerHandler = multerInstance.single(injectedData.single.name) as ExRequestHandler;
    } else if (injectedData.array) {
      multerHandler = multerInstance.array(
        injectedData.array.name,
        injectedData.array.maxCount
      ) as ExRequestHandler;
    } else {
      multerHandler = multerInstance.fields(
        injectedData.fields as IMulterFileOption[]
      ) as ExRequestHandler;
    }
    const listInjectedData: IApiBeforeInjectedData[] =
      Reflect.getMetadata(metadataMethodKey, target, propertyKey) || [];
    listInjectedData.push({ requestHandle: multerHandler, type: 'Multer' });
    listInjectedData.push({ requestHandle: multerProcessHandler, type: 'Multer' });
    Reflect.defineMetadata(metadataMethodKey, listInjectedData, target, propertyKey);
    return descriptor;
  };
}
const MulterProcess = getDecoratorMethod(
  getProcessApiBeforeMulterDecorator(ApiBeforeProcessRequestKey)
);
export const Multer = (injectedData: IApiMulterInjectedData): MethodDecorator =>
  MulterProcess(injectedData);
