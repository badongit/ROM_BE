import { Injectable } from '@nestjs/common';
import { OrderDetailStatusEnum } from '@src/components/order/constants/status.enum';
import { CreateOrderDto } from '@src/components/order/dto/create-order.dto';
import { OrderDetail } from '@src/components/order/entities/order-details.entity';
import { Order } from '@src/components/order/entities/order.entity';
import { IOrderRepository } from '@src/components/order/interfaces/order.repository.interface';
import { BaseRepository } from '@src/core/repositories/base.repository';

@Injectable()
export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  createEntity(request: CreateOrderDto): Order {
    const { type, status, note, tableId, customerId, waitingTicket, details } =
      request;
    const orderEntity = new Order();
    orderEntity.type = type;
    orderEntity.status = status;
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
