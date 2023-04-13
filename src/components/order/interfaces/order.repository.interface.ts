import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from '../dto/request/update-order.request.dto';
import { Order } from '../entities/order.entity';

export interface IOrderRepository extends BaseRepository<Order> {
  createEntity(request: CreateOrderRequestDto): Order;
  updateEntity(entity: Order, request: UpdateOrderRequestDto): Order;
}
