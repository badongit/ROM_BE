import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { OrderResponseDto } from '../dto/response/order.response.dto';

export interface IOrderService {
  create(
    request: CreateOrderRequestDto,
  ): Promise<ResponsePayload<OrderResponseDto>>;
}
