import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';

export interface IOrderRepository extends BaseRepository<Order> {
  createEntity(request: CreateOrderDto): Order;
}
