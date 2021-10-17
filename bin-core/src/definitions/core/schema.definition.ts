import { Moment } from 'moment';
import { TypeConstructor } from './common.definition';
import { IValidationError } from './validation.definition';

//=====================================================================================
export interface IValidationCore<T = any> {
  isRequired?: boolean;
  validate?: (
    data?: T,
    pathName?: string
  ) => (IValidationError | undefined) | Promise<IValidationError | undefined>;
}
//=====================================================================================
export type IValidationBoolean = IValidationCore;
//=====================================================================================
export type SupportedStringFormat = 'isEmail' | RegExp;
export interface IValidationString extends IValidationCore<string> {
  minLength?: number;
  maxLength?: number;
  format?: SupportedStringFormat;
}
//=====================================================================================
export interface IValidationNumber extends IValidationCore<number> {
  min?: number;
  max?: number;
}
export type IValidationInteger = IValidationNumber;
//=====================================================================================
export interface IValidationFile extends IValidationCore<Express.Multer.File | any> {
  mimetype?: string;
  minSize?: number;
  maxSize?: number;
}
//=====================================================================================
export interface IValidationDate extends IValidationCore<Date> {
  min?: Date | Moment;
  max?: Date | Moment;
}
//=====================================================================================
export type IValidationEnum = IValidationCore<any>;
//=====================================================================================
export interface IValidationArray<I> extends IValidationCore<I[]> {
  minLength?: number;
  maxLength?: number;
}
//=====================================================================================
export interface IValidationObject<T = any> extends IValidationCore<T> {
  isNotAlowExtProperties?: boolean;
}

//=====================================================================================
//=====================================================================================
//=====================================================================================
export type SchemaType =
  | 'boolean'
  | 'string'
  | 'number'
  | 'integer'
  | 'enum'
  | 'date'
  | 'file'
  | 'array'
  | 'object'
  | undefined;

export interface ISchemaCore<T = any, V extends IValidationCore<T> = IValidationCore> {
  type?: SchemaType;
  /**
   * propertyType only should be defined in item schema of array schema
   */
  propertyType?: TypeConstructor<T>;
  description?: string;
  validation?: V;
}

export type IBooleanSchema = ISchemaCore<boolean, IValidationBoolean>;
export type IStringSchema = ISchemaCore<string, IValidationString>;
export type INumberSchema = ISchemaCore<number, IValidationNumber>;
export type IIntegerSchema = INumberSchema;
export type IFileSchema = ISchemaCore<Express.Multer.File | any, IValidationFile>;
export type IDateSchema = ISchemaCore<Date, IValidationDate>;
export interface IEnumSchema extends ISchemaCore<any, IValidationEnum> {
  enumValues: any[];
  enumName?: string;
}
export interface IArraySchema<I = any> extends ISchemaCore<Array<I>, IValidationArray<I>> {
  itemSchema?: ISchemaCore<I>;
}
export interface IObjectSchema<T = any> extends ISchemaCore<T, IValidationObject<T>> {
  properties?: { [key in keyof T]: ISchemaGeneral };
}
//=====================================================================================
export type ISchemaGeneral =
  | IBooleanSchema
  | IBooleanSchema
  | IStringSchema
  | INumberSchema
  | IIntegerSchema
  | IFileSchema
  | IDateSchema
  | IEnumSchema
  | IArraySchema
  | IObjectSchema;

//=====================================================================================

export const BooleanSchema: IBooleanSchema = { type: 'boolean' };
export const StringSchema: IStringSchema = { type: 'string' };
export const NumberSchema: INumberSchema = { type: 'number' };
export const IntegerSchema: IIntegerSchema = { type: 'integer' };
export const DateSchema: IDateSchema = { type: 'date' };
export const FileSchema: IFileSchema = { type: 'file' };
export const EnumSchema: IEnumSchema = { type: 'enum', enumValues: [] };
export const ArraySchema: IArraySchema = { type: 'array' };
export const ObjectSchema: IObjectSchema = { type: 'object' };

export const BooleanRequireSchema: IBooleanSchema = {
  type: 'boolean',
  validation: { isRequired: true },
};
export const StringRequireSchema: IStringSchema = {
  type: 'string',
  validation: { isRequired: true },
};
export const NumberRequireSchema: INumberSchema = {
  type: 'number',
  validation: { isRequired: true },
};
export const IntegerRequireSchema: IIntegerSchema = {
  type: 'integer',
  validation: { isRequired: true },
};
export const DateRequireSchema: IDateSchema = { type: 'date', validation: { isRequired: true } };
export const FileRequireSchema: IFileSchema = { type: 'file', validation: { isRequired: true } };
export const EnumRequireSchema: IEnumSchema = {
  type: 'enum',
  enumValues: [],
  validation: { isRequired: true },
};
export const ArrayRequireSchema: IArraySchema = { type: 'array', validation: { isRequired: true } };
export const ObjectRequireSchema: IObjectSchema = {
  type: 'object',
  validation: { isRequired: true },
};
