import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from '@src/components/order/entities/order-details.entity';
import { IOrderDetailRepository } from '@src/components/order/interfaces/order-detail.repository.interface';
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
}
