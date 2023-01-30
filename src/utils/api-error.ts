import { ResponseCodeEnum } from 'src/constants/enum/response-code.enum';
import { ResponseBuilder } from './response-builder';
import { ErrorResponse } from '../core/interfaces/response-payload';

export class ApiError extends Error {
  private readonly _errorCode: ResponseCodeEnum;
  private readonly _message: string;
  errors: ErrorResponse = {};

  constructor(errorCode: ResponseCodeEnum, message: string) {
    super(message);

    this._errorCode = errorCode;
    this._message = message;
  }

  get errorCode(): ResponseCodeEnum {
    return this._errorCode;
  }

  get message(): string {
    return this._message;
  }

  withErrors(errors: ErrorResponse) {
    this.errors = {
      ...this.errors,
      ...errors,
    };
    return this;
  }

  toResponse() {
    return new ResponseBuilder()
      .withCode(this.errorCode)
      .withMessage(this.message)
      .withErrors(this.errors)
      .build();
  }
}
