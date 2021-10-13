/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import {
  CONSTRUCTOR_SCHEMA_KEY,
  IArraySchema,
  IContainer,
  Identifier,
  IdentifyOption,
  IObjectSchema,
  ISchemaCore,
  SchemaType,
  TypeConstructor,
  TypeProcessInjectedClass,
  TypeProcessInjectedMethod,
  TypeProcessInjectedMethodParams,
  TypeProcessInjectedProperty,
  TypeProcessInjectedPropertyRequireInjectData,
} from 'src/definitions';

export const Injector = new (class {
  getInstance<T>(target: TypeConstructor<any>): T {
    const dependencies: any[] = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = dependencies.map((dependency: TypeConstructor<any>) =>
      Injector.getInstance<any>(dependency)
    );
    return new target(...injections);
  }
})();

// ==================================================================================================================
// class
/**
 * collect singleton injected class's information
 * @param container
 */
export function getDefaultProcessInjectableDecorator<T, K extends IdentifyOption | Identifier>(
  defaultContainer: IContainer<any>
): TypeProcessInjectedClass<T, K> {
  return (target: TypeConstructor<T>, injectedData: K, inputContainer?: IContainer): void => {
    const container = inputContainer || defaultContainer;
    const nameKey =
      typeof injectedData === 'string' || typeof injectedData === 'symbol'
        ? injectedData
        : (injectedData as IdentifyOption).name;
    if (container.get(nameKey)) {
      throw new Error(
        `Error! ${injectedData as string} is already registered! Please recheck ${target}`
      );
    }
    const instance = Injector.getInstance(target);
    Object.defineProperty(instance, 'injectedData', {
      get: () => injectedData,
    });
    container.bind(injectedData, instance);
  };
}

// ==================================================================================================================
// property
/**
 * collect singleton injected property's information
 */
export function getDefaultTypeProcessInjectedPropertyDecorator<
  T extends Identifier | IdentifyOption,
  I = unknown
>(defaultContainer: IContainer<any>): TypeProcessInjectedProperty<T> {
  return (
    target: any,
    propertyName: Identifier,
    injectedData?: T,
    inputContainer?: IContainer<I>
  ): void => {
    if (!injectedData) {
      throw new Error('Can not detect name key for get instance!');
    }
    if (typeof target[propertyName] === 'function') {
      throw new Error(`Can not process injected property for method ${propertyName.toString()}!`);
    }
    const container = inputContainer || defaultContainer;
    Object.defineProperty(target, propertyName, {
      get: () => {
        const nameKey =
          typeof injectedData === 'string' || typeof injectedData === 'symbol'
            ? injectedData
            : (injectedData as IdentifyOption).name;
        return container.get(nameKey);
      },
    });
  };
}

export const defineMapKeyPropertyTypeDecorator = (data: { name?: string; index?: number }) =>
  `${data.name}_${data.index}`;
/**
 * collect data type of object
 */
export function getDefaultProcessPropertyTypeDecorator<T extends ISchemaCore = ISchemaCore>(
  metadataPropertyKey: Identifier,
  mapSchema: any,
  constructorSchemaKey?: string,
  defineMapKey?: (data: { name?: string; index?: number }) => string
): TypeProcessInjectedPropertyRequireInjectData<T> {
  return (target: any, propertyName: Identifier, injectedData: T): void => {
    if (typeof target[propertyName] === 'function') {
      throw new Error(`Can not process injected property for method ${propertyName.toString()}!`);
    }
    if (!injectedData) {
      throw new Error('Injected data is require of this decorator!');
    }

    const propertyType: TypeConstructor<any> =
      injectedData.propertyType || Reflect.getMetadata('design:type', target, propertyName);
    if (!injectedData.type) {
      injectedData.type = propertyType.name.toLowerCase() as SchemaType;
      if (
        injectedData.type !== 'boolean' &&
        injectedData.type !== 'string' &&
        injectedData.type !== 'number' &&
        injectedData.type !== 'integer' &&
        injectedData.type !== 'enum' &&
        injectedData.type !== 'date' &&
        injectedData.type !== 'file' &&
        injectedData.type !== 'array' &&
        injectedData.type !== 'object'
      ) {
        injectedData.type = 'object';
      }
    }

    const name = target.constructor.name;
    let index = 0;

    if (!target.constructor[constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY]) {
      while (mapSchema[(defineMapKey || defineMapKeyPropertyTypeDecorator)({ name, index })]) {
        index++;
      }
      target.constructor[constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY] = {
        constructor: target.constructor,
        index,
      };
    } else {
      index = target.constructor[constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY]?.index;
    }
    const constructorMapKey = (defineMapKey || defineMapKeyPropertyTypeDecorator)({ name, index });

    const targetSchema: IObjectSchema =
      mapSchema[constructorMapKey] ||
      ({
        type: 'object',
        properties: {},
        propertyType: target.constructor,
      } as IObjectSchema);

    let propertySchema;
    if (injectedData.type === 'array') {
      let tempSchema = { ...injectedData } as IArraySchema;
      const doWithArraySchema = (tempSchema: ISchemaCore) => {
        const type = tempSchema.type || tempSchema.propertyType?.name.toLowerCase();
        if (type !== 'array') {
          const tempName = tempSchema.propertyType?.name;
          const tempIndex =
            tempSchema.propertyType?.prototype.constructor[
              constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY
            ]?.index;
          const tempConstructorMapKey = (defineMapKey || defineMapKeyPropertyTypeDecorator)({
            name: tempName,
            index: tempIndex,
          });

          return { ...tempSchema, ...mapSchema[tempConstructorMapKey] };
        } else if ((tempSchema as IArraySchema).itemSchema) {
          (tempSchema as IArraySchema).itemSchema = doWithArraySchema(
            (tempSchema as IArraySchema).itemSchema as ISchemaCore
          );
        }
        return tempSchema;
      };
      tempSchema = doWithArraySchema(tempSchema);
      propertySchema = tempSchema;
    } else {
      const tempName = propertyType.name;
      const tempIndex =
        propertyType.prototype.constructor[constructorSchemaKey || CONSTRUCTOR_SCHEMA_KEY]?.index;
      const tempConstructorMapKey = (defineMapKey || defineMapKeyPropertyTypeDecorator)({
        name: tempName,
        index: tempIndex,
      });
      const tempSchema = {
        ...mapSchema[tempConstructorMapKey],
        ...injectedData,
        propertyType,
      };
      propertySchema = tempSchema;
    }

    const properties = targetSchema.properties || {};
    properties[propertyName.toString()] = propertySchema;
    targetSchema.properties = properties;

    mapSchema[constructorMapKey] = targetSchema;

    if (metadataPropertyKey && target.constructor && !target.constructor[metadataPropertyKey]) {
      target.constructor[metadataPropertyKey] = () => target;
    }
    Reflect.defineMetadata(
      metadataPropertyKey,
      { ...(injectedData || {}), propertyType },
      target,
      propertyName
    );
  };
}

// ==================================================================================================================
// method - function
/**
 * collect injected method's information relate to metadataMethodKey
 * @param metadataMethodKey
 * @param type
 */
export function getDefaultProcessMethodDecorator<T>(
  metadataMethodKey: Identifier
): TypeProcessInjectedMethod<T> {
  return (
    target: any,
    methodName: Identifier,
    descriptor: TypedPropertyDescriptor<any>,
    injectedData?: T
  ): TypedPropertyDescriptor<any> | void => {
    if (typeof target[methodName] !== 'function') {
      throw new Error(`Can not process injected method for un-method ${methodName.toString()}!`);
    }
    if (!Reflect.hasMetadata(metadataMethodKey, target, methodName)) {
      Reflect.defineMetadata(metadataMethodKey, { ...injectedData }, target, methodName);
    }
    const methodKeys: any[] = Reflect.getMetadata(metadataMethodKey, target) || [];
    if (!methodKeys.includes(methodName)) {
      methodKeys.push(methodName);
      Reflect.defineMetadata(metadataMethodKey, methodKeys, target);
    }
    return descriptor;
  };
}

// ==================================================================================================================
// param -
/**
 * collect injected parameter's information relate to metadataParamKey
 * @param metadataParamKey
 * @param type
 */
export function getDefaultProcessMethodParamDecorator<T>(
  metadataParamKey: Identifier
): TypeProcessInjectedMethodParams<T> {
  return (target: any, methodName: Identifier, index: number, injectedData?: T): void => {
    const injectedDataOfParams = Reflect.getMetadata(metadataParamKey, target, methodName) || {};
    injectedDataOfParams[index] = injectedData;
    Reflect.defineMetadata(metadataParamKey, injectedDataOfParams, target, methodName);
  };
}
// ==================================================================================================================
