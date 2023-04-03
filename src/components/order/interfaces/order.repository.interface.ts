import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { Order } from '../entities/order.entity';

export interface IOrderRepository extends BaseRepository<Order> {
  createEntity(request: CreateOrderRequestDto): Order;
}
