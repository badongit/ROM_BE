import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { OrderResponseDto } from '../dto/response/order.response.dto';
import { ListOrderQueryDto } from '../dto/request/list-order.query.dto';
import { DetailOrderResponseDto } from '../dto/response/detail-order.response.dto';
import { UpdateOrderRequestDto } from '../dto/request/update-order.request.dto';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';

export interface IOrderService {
  create(
    request: CreateOrderRequestDto,
  ): Promise<ResponsePayload<OrderResponseDto>>;
  update(
    request: UpdateOrderRequestDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>>;
  list(
    request: ListOrderQueryDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto>>;

  confirmOrder(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>>;
  cancelOrder(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>>;
}
