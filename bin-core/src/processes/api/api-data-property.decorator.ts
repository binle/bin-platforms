/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  ApiPropertyKey,
  CONSTRUCTOR_SCHEMA_KEY,
  IApiPropertyInjectedData,
  IArrayPropertyInjectedData,
  IArraySchema,
  Identifier,
  IEnumPropertyInjectedData,
  IEnumSchema,
  IFilePropertyInjectedData,
  IObjectSchema,
  ISchemaCore,
  TypeConstructor,
} from 'src/definitions';
import {
  createPropertyTypeDecorator,
  defineMapKeyPropertyTypeDecorator,
  getAllDecoratedPropertyTypes,
  getInjectedPramsOfPropertyType,
  getSchemaFromInstance,
  getSchemaFromType,
} from './../core';

const mapSchema: { [key: string]: ISchemaCore } = {};
// =====================================================================================================================

const defineOption = (option?: IApiPropertyInjectedData, isRequired?: boolean) => {
  const optionTemp = option || {};
  optionTemp.validation = { ...optionTemp.validation, isRequired };
  if (!optionTemp.type) {
    if ((optionTemp as IObjectSchema).properties) {
      optionTemp.type = 'object';
    }
    if ((optionTemp as IArraySchema).itemSchema) {
      optionTemp.type = 'array';
    }
    if ((optionTemp as IEnumSchema).enumValues) {
      optionTemp.type = 'enum';
    }
  }
  return optionTemp;
};

const ApiPropertyProcess = createPropertyTypeDecorator(ApiPropertyKey, mapSchema);

export const ApiProperty = (option?: IApiPropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption(option, true));

export const ApiPropertyOptional = (option?: IApiPropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption(option));

export const EnumProperty = (option: IEnumPropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption({ ...option, type: 'enum' }, true));

export const EnumPropertyOptional = (option: IEnumPropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption({ ...option, type: 'enum' }));

export const ArrayProperty = (option: IArrayPropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption({ ...option, type: 'array' }, true));

export const ArrayPropertyOptional = (option: IArrayPropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption({ ...option, type: 'array' }));

export const FileProperty = (option: IFilePropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption({ ...option, type: 'file' }, true));

export const FilePropertyOptional = (option: IFilePropertyInjectedData): PropertyDecorator =>
  ApiPropertyProcess(defineOption({ ...option, type: 'file' }));

// =====================================================================================================================
export const getAllDefinedPropertyTypesInObject = (instanceObject: any): string[] =>
  getAllDecoratedPropertyTypes(instanceObject, ApiPropertyKey);

export const getInjectedPramsOfPropertyTypeInObject = (
  target: any,
  propertyName: Identifier
): any => getInjectedPramsOfPropertyType(target, propertyName, ApiPropertyKey);

export const getSchemaOfInstance = (prototype: any): ISchemaCore | undefined =>
  getSchemaFromInstance(mapSchema, prototype);

export const getSchemaOfType = (type: TypeConstructor): ISchemaCore | undefined =>
  getSchemaFromType(mapSchema, type);

export const getMapSchemaOfApiProperty = () => mapSchema;

export const defineMapKeyPropertyTypeDecoratorFromType = (type: TypeConstructor): string => {
  const data = type?.prototype?.constructor[CONSTRUCTOR_SCHEMA_KEY];
  return data
    ? defineMapKeyPropertyTypeDecorator({
        name: data.constructor.name,
        index: data.index,
      })
    : '';
};
// =====================================================================================================================
// =====================================================================================================================
