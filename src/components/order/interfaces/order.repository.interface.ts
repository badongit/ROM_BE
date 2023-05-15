import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateOrderRequestDto } from '../dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from '../dto/request/update-order.request.dto';
import { Order } from '../entities/order.entity';
import { ListOrderQueryDto } from '../dto/request/list-order.query.dto';
import { CompleteOrderRequestDto } from '../dto/request/complete-order.request.dto';
import { OrderStatisticsRequestDto } from '@src/components/dashboard/dto/request/order-statistics.request.dto';
import { RevenueStatisticsRequestDto } from '@src/components/dashboard/dto/request/revenue-statistics.request.dto';

export interface IOrderRepository extends BaseRepository<Order> {
  createEntity(request: CreateOrderRequestDto): Order;
  updateEntity(entity: Order, request: UpdateOrderRequestDto): Order;
  completeEntity(entity: Order, request: CompleteOrderRequestDto): Order;
  list(request: ListOrderQueryDto): Promise<[Order[], number]>;
  detail(id: number): Promise<Order>;
  revenueStatistics(request: RevenueStatisticsRequestDto): Promise<any>;
  orderStatistics(request: OrderStatisticsRequestDto): Promise<any>;
}
