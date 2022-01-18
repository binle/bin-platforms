/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import moment from 'moment';
import {
  IArraySchema,
  IBooleanSchema,
  IDateSchema,
  IEnumSchema,
  IFileSchema,
  IIntegerSchema,
  INumberSchema,
  IObjectSchema,
  ISchemaCore,
  IStringSchema,
  IValidationError,
  ValidationError,
} from 'src/definitions';

export const asyncValidateString = async (
  schema: IStringSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'string') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as string.`);
  }
  if (
    schema.validation?.minLength !== undefined &&
    schema.validation?.maxLength !== undefined &&
    schema.validation?.minLength > schema.validation?.maxLength
  ) {
    throw new Error(
      `The schema use for validate ${name} is invalid, the string min length is bigger max length.`
    );
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  if (typeof data !== 'string') {
    return new ValidationError(name, `${name} is not string.`);
  }
  const dataValue = data as string;
  if (
    (schema.validation?.minLength !== undefined &&
      dataValue.length < schema.validation?.minLength) ||
    (schema.validation?.maxLength !== undefined && dataValue.length > schema.validation?.maxLength)
  ) {
    let stringError = `${name} must have length`;
    stringError += schema.validation?.minLength ? ` >= ${schema.validation?.minLength}` : '';
    stringError += schema.validation?.maxLength
      ? `${schema.validation?.minLength ? ' and ' : ' '}<= ${schema.validation?.maxLength}`
      : '';
    stringError += '.';
    return new ValidationError(name, stringError);
  }

  if (schema.validation?.format) {
    switch (schema.validation?.format) {
      case 'isEmail': {
        const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return emailRegEx.test(dataValue)
          ? undefined
          : new ValidationError(name, `${name} is not email.`);
      }
      default: {
        const formatRegEx = new RegExp(schema.validation?.format);
        return formatRegEx.test(dataValue)
          ? undefined
          : new ValidationError(name, `${name} is not correct the format.`);
      }
    }
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(dataValue, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateNumber = async (
  schema: INumberSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'number') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as number.`);
  }
  if (
    schema.validation?.min !== undefined &&
    schema.validation?.max !== undefined &&
    schema.validation?.min > schema.validation?.max
  ) {
    throw new Error(
      `The schema use for validate ${name} is invalid, the min number is bigger max number.`
    );
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  const dataValue = Number(`${data}`);
  if (isNaN(dataValue)) {
    return new ValidationError(name, `${name} is not number.`);
  }
  if (
    (schema.validation?.min !== undefined && dataValue < schema.validation?.min) ||
    (schema.validation?.max !== undefined && dataValue > schema.validation?.max)
  ) {
    let stringError = `${name} must be`;
    stringError += schema.validation?.min ? ` >= ${schema.validation?.min}` : '';
    stringError += schema.validation?.max
      ? `${schema.validation?.min ? ' and ' : ' '}<= ${schema.validation?.max}`
      : '';
    stringError += '.';
    return new ValidationError(name, stringError);
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(dataValue, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateInteger = async (
  schema: IIntegerSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'integer') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as integer.`);
  }
  if (
    schema.validation?.min !== undefined &&
    schema.validation?.max !== undefined &&
    schema.validation?.min > schema.validation?.max
  ) {
    throw new Error(
      `The schema use for validate ${name} is invalid, the min integer is bigger max integer.`
    );
  }

  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  const dataValue = Number(`${data}`);
  if (isNaN(dataValue)) {
    return new ValidationError(name, `${name} is not number.`);
  }
  if (isNaN(dataValue) || Math.floor(Math.abs(dataValue)) !== Math.abs(dataValue)) {
    return new ValidationError(name, `${name} is not integer.`);
  }
  if (
    (schema.validation?.min !== undefined && dataValue < schema.validation?.min) ||
    (schema.validation?.max !== undefined && dataValue > schema.validation?.max)
  ) {
    let stringError = `${name} must be`;
    stringError += schema.validation?.min ? ` >= ${schema.validation?.min}` : '';
    stringError += schema.validation?.max
      ? `${schema.validation?.min ? ' and ' : ' '}<= ${schema.validation?.max}`
      : '';
    stringError += '.';
    return new ValidationError(name, stringError);
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(dataValue, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateFile = async (
  schema: IFileSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'file') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as file.`);
  }
  if (
    schema.validation?.minSize !== undefined &&
    schema.validation?.maxSize !== undefined &&
    schema.validation?.minSize > schema.validation?.maxSize
  ) {
    throw new Error(
      `The schema use for validate ${name} is invalid, the min number is bigger max number.`
    );
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  const dataValue = data as Express.Multer.File;
  if (
    (schema.validation?.minSize !== undefined && dataValue.size < schema.validation?.minSize) ||
    (schema.validation?.maxSize !== undefined && dataValue.size > schema.validation?.maxSize)
  ) {
    let stringError = `Size of file ${name} must be`;
    stringError += schema.validation?.minSize ? ` >= ${schema.validation?.minSize}` : '';
    stringError += schema.validation?.maxSize
      ? `${schema.validation?.minSize ? ' and ' : ' '}<= ${schema.validation?.maxSize}`
      : '';
    stringError += '.';
    return new ValidationError(name, stringError);
  }
  if (schema.validation?.mimetype && schema.validation?.mimetype !== dataValue.mimetype) {
    return new ValidationError(
      name,
      `Type of file ${name} must be ${schema.validation?.mimetype}.`
    );
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(dataValue, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateDate = async (
  schema: IDateSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'date') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as date.`);
  }
  const dateMin = schema.validation?.min ? moment(schema.validation?.min) : undefined;
  const dateMax = schema.validation?.max ? moment(schema.validation?.max) : undefined;
  if (dateMin && dateMax && dateMin > dateMax) {
    throw new Error(
      `The schema use for validate ${name} is invalid, the min date is bigger max date.`
    );
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  const dataMoment = moment(data);
  if (!dataMoment.isValid()) {
    return new ValidationError(name, `${name} is not date.`);
  }
  if (
    (dateMin !== undefined && dataMoment < dateMin) ||
    (dateMax !== undefined && dataMoment > dateMax)
  ) {
    let stringError = `${name} must be`;
    stringError += dateMin ? ` >= ${dateMin}` : '';
    stringError += dateMax ? `${dateMin ? ' and ' : ' '}<= ${dateMax}` : '';
    stringError += '.';
    return new ValidationError(name, stringError);
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(data, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateBoolean = async (
  schema: IBooleanSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'boolean') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as boolean.`);
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  let dataValue = data;
  if (typeof data === 'string') {
    if (data === 'true') {
      dataValue = true;
    } else if (data === 'false') {
      dataValue = false;
    }
  }
  if (typeof dataValue !== 'boolean') {
    return new ValidationError(name, `${name} is not boolean.`);
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(data, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateEnum = async (
  schema: IEnumSchema,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'enum') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as enum.`);
  }
  if (!schema.enumValues || !schema.enumValues.length) {
    throw new Error('The schema is invalid, values of enum are not passed!');
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  if (!schema.enumValues.includes(data)) {
    return new ValidationError(
      name,
      `${name} is not enum's values [${schema.enumValues.join(',')}].`
    );
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(data, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateArray = async <T>(
  schema: IArraySchema<T>,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== 'array') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as array.`);
  }
  if (
    schema.validation?.minLength !== undefined &&
    schema.validation?.maxLength !== undefined &&
    schema.validation?.minLength > schema.validation?.maxLength
  ) {
    throw new Error(
      `The schema use for validate ${name} is invalid, the array min length is bigger max length.`
    );
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  if (!(data instanceof Array)) {
    return new ValidationError(name, `${name} is not array to can validate.`);
  }
  if (
    (schema.validation?.minLength !== undefined && data.length < schema.validation?.minLength) ||
    (schema.validation?.maxLength !== undefined && data.length > schema.validation?.maxLength)
  ) {
    let stringError = `${name} must have length`;
    stringError += schema.validation?.minLength ? ` >= ${schema.validation?.minLength}` : '';
    stringError += schema.validation?.maxLength
      ? `${schema.validation?.minLength ? ' and ' : ' '}<= ${schema.validation?.maxLength}`
      : '';
    stringError += '.';
    return new ValidationError(name, stringError);
  }
  if (schema.itemSchema) {
    for (let index = 0; index < data.length; index++) {
      const isCorrect = !(await asyncValidate(schema.itemSchema, data[index], `${name}[${index}]`));
      if (!isCorrect) {
        return new ValidationError(name, `${name}[${index}] is not valid with schema.`);
      }
    }
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(data, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidateObject = async <T = unknown>(
  schema: IObjectSchema<T>,
  data?: T,
  name?: string
): Promise<IValidationError | undefined> => {
  name = name || 'data';
  if (schema.type !== undefined && schema.type !== 'object') {
    throw new Error(`The schema is invalid, it is not use for validate ${name} as object.`);
  }
  if (data === undefined || data === null) {
    return schema.validation?.isRequired
      ? new ValidationError(name, `${name} is required.`)
      : undefined;
  }
  if (typeof data !== 'object') {
    return new ValidationError(name, `${name} is not object to can validate.`);
  }
  if (schema.validation?.isNotAlowExtProperties && schema.properties) {
    for (const key in data) {
      if (!schema.properties[key]) {
        return new ValidationError(name, `${key} is not alow exist in ${name}.`);
      }
    }
  }
  if (schema.properties) {
    for (const key in schema.properties) {
      const result = await asyncValidate(schema.properties[key], data[key], `${name}.${key}`);
      if (result) {
        return result;
      }
    }
  }
  if (schema.validation?.validate) {
    if (typeof schema.validation?.validate === 'function') {
      return await schema.validation?.validate(data, name);
    } else {
      console.warn('validate of schema should be function [(data, name)=> IValidationError].');
    }
  }
};

export const asyncValidate = async (
  schema?: ISchemaCore<any>,
  data?: any,
  name?: string
): Promise<IValidationError | undefined> => {
  if (!schema) {
    return;
  }
  name = name || 'data';
  // 'boolean' | 'string' | 'number' | 'integer' | 'date' | 'file' | 'array' | 'object'
  switch (schema.type) {
    case 'boolean': {
      return await asyncValidateBoolean(schema as IBooleanSchema, data, name);
    }
    case 'string': {
      return await asyncValidateString(schema as IStringSchema, data, name);
    }
    case 'number': {
      return await asyncValidateNumber(schema as INumberSchema, data, name);
    }
    case 'integer': {
      return await asyncValidateInteger(schema as IIntegerSchema, data, name);
    }
    case 'date': {
      return await asyncValidateDate(schema as IDateSchema, data, name);
    }
    case 'enum': {
      return await asyncValidateEnum(schema as IEnumSchema, data, name);
    }
    case 'array': {
      return await asyncValidateArray(schema as IArraySchema<any>, data, name);
    }
    case 'file': {
      return await asyncValidateFile(schema as IFileSchema, data, name);
    }
    case undefined:
    case 'object': {
      return await asyncValidateObject(schema as IObjectSchema, data, name);
    }
    default: {
      throw new ValidationError(name, `can not define data type for validation of ${name}.`);
    }
  }
};
