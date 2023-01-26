import { ResponseCodeEnum } from 'src/constants/enum/response-code.enum';

export interface ResponsePayload<T> {
  statusCode: ResponseCodeEnum;
  message?: string;
  data?: T | PaginationData<T>;
  errors?: ErrorResponse;
}

export interface PaginationData<T> {
  items: T[];
  meta: Meta;
}

export interface Meta {
  page: number;
  total: number;
}

export interface ErrorResponse {
  [property: string]: string;
}
