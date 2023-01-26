import { MessageEnum } from 'src/constants/enum/message.enum';
import { ResponseCodeEnum } from 'src/constants/enum/response-code.enum';
import {
  ErrorResponse,
  PaginationData,
  ResponsePayload,
} from '../core/interfaces/response-payload';

export class ResponseBuilder<T> {
  private payload: ResponsePayload<T> = {
    statusCode: ResponseCodeEnum.OK,
  };

  constructor(
    data?: T | PaginationData<T>,
    statusCode?: ResponseCodeEnum,
    message?: string,
    errors?: ErrorResponse,
  ) {
    this.payload.data = data;
    this.payload.statusCode = statusCode ?? this.payload.statusCode;
    this.payload.message = message ?? MessageEnum.SUCCESS;
    this.payload.errors = errors ? errors : {};
  }

  withCode(statusCode: ResponseCodeEnum) {
    this.payload.statusCode = statusCode;
    return this;
  }

  withMessage(message: string) {
    this.payload.message = message;
    return this;
  }

  withData(data: T | PaginationData<T>) {
    this.payload.data = data;
    return this;
  }

  withErrors(errors: ErrorResponse) {
    this.payload.errors = errors;
    return this;
  }

  build(): ResponsePayload<T> {
    return this.payload;
  }
}
