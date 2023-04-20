import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ChangeStatusOrderDetailRequestDto } from '../dto/request/change-status-order-detail.request.dto';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { ListOrderQueryDto } from '../dto/request/list-order.query.dto';
import { UpdateOrderRequestDto } from '../dto/request/update-order.request.dto';
import { DetailOrderResponseDto } from '../dto/response/detail-order.response.dto';
import { OrderDetailResponseDto } from '../dto/response/order-detail.response.dto';
import { CompleteOrderRequestDto } from '../dto/request/complete-order.request.dto';

export interface IOrderService {
  create(
    request: CreateOrderRequestDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>>;
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
  changeStatusOrderDetail(
    request: ChangeStatusOrderDetailRequestDto,
  ): Promise<ResponsePayload<OrderDetailResponseDto | any>>;
  completeOrder(
    request: CompleteOrderRequestDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>>;
}
