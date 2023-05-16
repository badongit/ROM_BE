import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetailStatusEnum } from '@src/components/order/constants/enums';
import { OrderDetail } from '@src/components/order/entities/order-details.entity';
import { IOrderDetailRepository } from '@src/components/order/interfaces/order-detail.repository.interface';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { Repository } from 'typeorm';

@Injectable()
export class OrderDetailRepository
  extends BaseRepository<OrderDetail>
  implements IOrderDetailRepository
{
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {
    super(orderDetailRepository);
  }

  dishOrderStatistics(request: PaginationQueryDto): Promise<any> {
    const { limit } = request;

    const query = this.orderDetailRepository
      .createQueryBuilder('od')
      .select(['od.dish_id AS dishId', 'SUM(od.quantity) AS sold'])
      .where('od.status = :status', { status: OrderDetailStatusEnum.COMPLETED })
      .groupBy('od.dish_id')
      .orderBy('sold', 'DESC')
      .limit(limit);

    return query.getRawMany();
  }
}
