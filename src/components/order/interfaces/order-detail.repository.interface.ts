import { BaseRepository } from '@src/core/repositories/base.repository';
import { OrderDetail } from '../entities/order-details.entity';

export interface IOrderDetailRepository extends BaseRepository<OrderDetail> {}
