import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { OrderDetail } from '../entities/order-details.entity';

export interface IOrderDetailRepository extends BaseRepository<OrderDetail> {
  dishOrderStatistics(request: PaginationQueryDto): Promise<any>;
}
