import { MessageEnum } from 'src/constants/enum/message.enum';
import { ResponseCodeEnum } from 'src/constants/enum/response-code.enum';
import { PaginationData, ResponsePayload } from './response-payload';

export class ResponseBuilder<T> {
  private payload: ResponsePayload<T> = {
    statusCode: ResponseCodeEnum.OK,
    message: MessageEnum.SUCCESS,
  };

  constructor(
    data?: T | PaginationData<T>,
    statusCode?: ResponseCodeEnum,
    message?: string,
  ) {
    this.payload.data = data;
    this.payload.statusCode = statusCode ?? this.payload.statusCode;
    this.payload.message = message ?? '';
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

  build(): ResponsePayload<T> {
    return this.payload;
  }
}
