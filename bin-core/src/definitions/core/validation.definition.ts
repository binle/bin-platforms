import { BinHttpError, IBinHttpError } from './error.definition';

export type IValidationError = IBinHttpError;
export class ValidationError extends BinHttpError {
  constructor(dataName: string, message: string) {
    super(message, 400);
    this.code = 'validation_error';
    this.data = { params: dataName };
  }
}
