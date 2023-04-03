import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PREFIX_ORDER_CODE } from '@src/components/order/constants';
import {
  OrderDetailStatusEnum,
  OrderStatusEnum,
} from '@src/components/order/constants/enums';
import { CreateOrderRequestDto } from '@src/components/order/dto/request/create-order.request.dto';
import { OrderDetail } from '@src/components/order/entities/order-details.entity';
import { Order } from '@src/components/order/entities/order.entity';
import { IOrderRepository } from '@src/components/order/interfaces/order.repository.interface';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { formatDateToOrderCode } from '@src/utils/common';
import { Repository } from 'typeorm';

@Injectable()
export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    super(orderRepository);
  }

  createEntity(request: CreateOrderRequestDto): Order {
    const { type, status, note, tableId, customerId, waitingTicket, details } =
      request;
    const orderEntity = new Order();
    orderEntity.code = PREFIX_ORDER_CODE + formatDateToOrderCode();
    orderEntity.type = type;
    orderEntity.status = status || OrderStatusEnum.IN_PROGRESS;
    orderEntity.note = note;
    orderEntity.tableId = tableId;
    orderEntity.customerId = customerId;
    orderEntity.waitingTicket = waitingTicket;
    orderEntity.details = details.map((detail) => {
      const { quantity, price, note, dishId } = detail;
      const detailEntity = new OrderDetail();
      detailEntity.quantity = quantity;
      detailEntity.price = price;
      detailEntity.note = note;
      detailEntity.dishId = dishId;
      detailEntity.status = OrderDetailStatusEnum.WAIT_CONFIRM;
      return detailEntity;
    });

    return orderEntity;
  }
}
