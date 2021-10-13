/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  CONSTRUCTOR_SCHEMA_KEY,
  IContainer,
  Identifier,
  IdentifyOption,
  ISchemaCore,
  TypeConstructor,
  TypeProcessInjectedClass,
  TypeProcessInjectedMethod,
  TypeProcessInjectedMethodParams,
  TypeProcessInjectedProperty,
  TypeProcessInjectedPropertyRequireInjectData,
} from 'src/definitions';
import {
  defineMapKeyPropertyTypeDecorator,
  getDefaultProcessInjectableDecorator,
  getDefaultProcessMethodDecorator,
  getDefaultProcessMethodParamDecorator,
  getDefaultProcessPropertyTypeDecorator,
  getDefaultTypeProcessInjectedPropertyDecorator,
} from './process-decorator-default';
import { singletonContainer } from './singleton-container';

// ==================================================================================================================
// ==================================================================================================================
// class
export function getDecoratorInjectable<T, K extends Identifier | IdentifyOption, I = unknown>(
  doWithTarget?: TypeProcessInjectedClass<T, K, I>
) {
  return (option: K, container?: IContainer<I>): ((target: TypeConstructor<T>) => void) => {
    return (target: TypeConstructor<T>): void => {
      doWithTarget && doWithTarget(target, option, container);
    };
  };
}
// ==================================================================================================================
// ==================================================================================================================
// field - property
export function getDecoratorInjectedProperty<K extends Identifier | IdentifyOption, I = unknown>(
  doWithTarget?: TypeProcessInjectedProperty<K>
) {
  return (option: K, container?: IContainer<I>): PropertyDecorator => {
    return (target: any, propertyKey: Identifier) => {
      doWithTarget && doWithTarget(target, propertyKey, option, container);
    };
  };
}

export function getDecoratorProperty<I, K extends ISchemaCore<I> = ISchemaCore<I>>(
  doWithTarget?: TypeProcessInjectedProperty<K> | TypeProcessInjectedPropertyRequireInjectData<K>
) {
  return (option?: K): PropertyDecorator => {
    return (target: any, propertyKey: Identifier) => {
      doWithTarget && doWithTarget(target, propertyKey, option as K);
    };
  };
}
// ==================================================================================================================
// ==================================================================================================================
// method - function
export function getDecoratorMethod<T>(doWithTarget?: TypeProcessInjectedMethod<T>) {
  return (injectedData?: T): MethodDecorator => {
    return (
      target: any,
      propertyKey: string | symbol,
      descriptor: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> | void => {
      return doWithTarget && doWithTarget(target, propertyKey, descriptor, injectedData);
    };
  };
}
// ==================================================================================================================
// ==================================================================================================================
export function getDecoratorParamInMethod<T>(doWithTarget?: TypeProcessInjectedMethodParams<T>) {
  return (injectedData?: T): ParameterDecorator => {
    return (
      target: any,
      propertyKey: Identifier,
      paramIndex: number
    ): TypedPropertyDescriptor<any> | void => {
      return doWithTarget && doWithTarget(target, propertyKey, paramIndex, injectedData);
    };
  };
}
// ==================================================================================================================
// ==================================================================================================================
// ==================================================================================================================
// ==================================================================================================================
// ==================================================================================================================
export const createInjectableDecorator = <K extends Identifier | IdentifyOption>(
  container: IContainer,
  processInjectableDecorator?: <T, K extends IdentifyOption | Identifier>(
    defaultContainer: IContainer<any>
  ) => TypeProcessInjectedClass<T, K>
) =>
  getDecoratorInjectable<any, K>(
    (processInjectableDecorator || getDefaultProcessInjectableDecorator)<any, K>(container)
  );

export const Injectable = createInjectableDecorator(singletonContainer);
// ==================================================================================================================
// ==================================================================================================================
export const createInjectedToPropertyDecorator = (container: IContainer) =>
  getDecoratorInjectedProperty(getDefaultTypeProcessInjectedPropertyDecorator(container));
export const InjectToProperty = createInjectedToPropertyDecorator(singletonContainer);
// ==================================================================================================================
// ==================================================================================================================
export const createMethodDecorator = <T>(
  methodKey: Identifier,
  processMethodDecorator?: <T>(metadataMethodKey: Identifier) => TypeProcessInjectedMethod<T>
) =>
  getDecoratorMethod<T>((processMethodDecorator || getDefaultProcessMethodDecorator)<T>(methodKey));

export const getAllDecoratedMethods = (instance: any, methodKey: Identifier): string[] =>
  Reflect.getMetadata(methodKey, instance);

export const getInjectedDataOfDecoratedMethod = <T>(
  instance: any,
  methodName: string,
  methodKey: Identifier
): T => Reflect.getMetadata(methodKey, instance, methodName);
// ==================================================================================================================
// ==================================================================================================================
export const createMethodParamDecorator = <T>(
  methodParamKey: Identifier,
  processMethodParamDecorator?: <T>(
    metadataParamKey: Identifier
  ) => TypeProcessInjectedMethodParams<T>
) =>
  getDecoratorParamInMethod<T>(
    (processMethodParamDecorator || getDefaultProcessMethodParamDecorator)<T>(methodParamKey)
  );

export const getAllInjectedDataOfDecoratedMethodParams = <T>(
  instance: any,
  methodName: string,
  methodParamKey: Identifier
): { [key: number]: T } => Reflect.getMetadata(methodParamKey, instance, methodName) || {};

export const getAllTypeConstructorOfAllParamsInMethod = (
  instance: any,
  methodName: string
): TypeConstructor[] => Reflect.getMetadata('design:paramtypes', instance, methodName);

// ==================================================================================================================
// ==================================================================================================================
export const createPropertyTypeDecorator = <T, OPT extends ISchemaCore>(
  propertyTypeKey: Identifier,
  mapSchema: { [key: string]: ISchemaCore },
  constructorSchemaKey?: string,
  defineMapKey?: (data: { name?: string; index?: number }) => string,
  processPropertyTypeDecorator?: <T extends ISchemaCore = ISchemaCore>(
    metadataPropertyKey: Identifier,
    mapSchema: { [key: string]: ISchemaCore },
    constructorSchemaKey?: string,
    defineMapKey?: (data: { name?: string; index?: number }) => string
  ) => TypeProcessInjectedPropertyRequireInjectData<T>
) =>
  getDecoratorProperty<T, OPT>(
    (processPropertyTypeDecorator || getDefaultProcessPropertyTypeDecorator)(
      propertyTypeKey,
      mapSchema,
      constructorSchemaKey,
      defineMapKey
    )
  );

export const getAllDecoratedPropertyTypes = (
  instance: any,
  propertyTypeKey: Identifier
): string[] => Reflect.getMetadata(propertyTypeKey, instance);

export const getInjectedPramsOfPropertyType = (
  target: any,
  propertyName: Identifier,
  propertyTypeKey: Identifier
): any => Reflect.getMetadata(propertyTypeKey, target, propertyName);

export const getSchemaFromInstance = (
  mapSchema: { [key: string]: ISchemaCore },
  prototype: any,
  constructorSchemaKey?: string,
  defineMapKey?: (data: { name?: string; index?: number }) => string
): ISchemaCore | undefined => {
  const data = prototype?.constructor[constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY];
  const key = data
    ? (defineMapKey || defineMapKeyPropertyTypeDecorator)({
        name: data.constructor.name,
        index: data.index,
      })
    : '';
  return key ? mapSchema[key] : undefined;
};

export const getSchemaFromType = (
  mapSchema: { [key: string]: ISchemaCore },
  type: TypeConstructor,
  constructorSchemaKey?: string,
  defineMapKey?: (data: { name?: string; index?: number }) => string
): ISchemaCore | undefined => {
  const data = type?.prototype?.constructor[constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY];
  const key = data
    ? (defineMapKey || defineMapKeyPropertyTypeDecorator)({
        name: data.constructor.name,
        index: data.index,
      })
    : '';
  return key ? mapSchema[key] : undefined;
};
