import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PREFIX_ORDER_CODE } from '@src/components/order/constants';
import {
  OrderDetailStatusEnum,
  OrderStatusEnum,
} from '@src/components/order/constants/enums';
import { CompleteOrderRequestDto } from '@src/components/order/dto/request/complete-order.request.dto';
import { CreateOrderRequestDto } from '@src/components/order/dto/request/create-order.request.dto';
import { ListOrderQueryDto } from '@src/components/order/dto/request/list-order.query.dto';
import { UpdateOrderRequestDto } from '@src/components/order/dto/request/update-order.request.dto';
import { OrderDetail } from '@src/components/order/entities/order-details.entity';
import { Order } from '@src/components/order/entities/order.entity';
import { IOrderRepository } from '@src/components/order/interfaces/order.repository.interface';
import { TableStatusEnum } from '@src/components/table/constants/status.enum';
import { SortEnum } from '@src/constants/enum/sort.enum';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { formatDateToOrderCode } from '@src/utils/common';
import { isEmpty } from 'lodash';
import { FindManyOptions, In, Repository } from 'typeorm';

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
    const createdAt = new Date();
    const orderEntity = new Order();
    orderEntity.code = PREFIX_ORDER_CODE + formatDateToOrderCode();
    orderEntity.type = type;
    orderEntity.status = status;
    orderEntity.note = note;
    orderEntity.tableId = tableId;
    orderEntity.customerId = customerId;
    orderEntity.waitingTicket = waitingTicket;
    orderEntity.createdAt = createdAt;
    orderEntity.details = details.map((detail) => {
      const { quantity, price, note, dishId } = detail;
      const detailEntity = new OrderDetail();
      detailEntity.quantity = quantity;
      detailEntity.price = price;
      detailEntity.note = note;
      detailEntity.dishId = dishId;
      detailEntity.status = OrderDetailStatusEnum.WAIT_CONFIRM;
      detailEntity.createdAt = createdAt;
      return detailEntity;
    });

    return orderEntity;
  }

  updateEntity(entity: Order, request: UpdateOrderRequestDto): Order {
    const { note, customerId, details } = request;
    const createdAt = new Date();
    entity.note = note;
    entity.customerId = customerId;

    entity.details = details.map((detail) => {
      const { quantity, price, note, dishId, id } = detail;
      const detailEntity = new OrderDetail();
      detailEntity.quantity = quantity;
      detailEntity.price = price;
      detailEntity.note = note;
      detailEntity.dishId = dishId;
      if (id) {
        detailEntity.id = id;
      } else {
        detailEntity.status = OrderDetailStatusEnum.WAIT_CONFIRM;
        detailEntity.createdAt = createdAt;
      }
      return detailEntity;
    });

    return entity;
  }

  completeEntity(entity: Order, request: CompleteOrderRequestDto): Order {
    const { note, paymentMethod, pointUsed } = request;
    entity.note = note;
    entity.paymentMethod = paymentMethod;
    entity.pointUsed = pointUsed || 0;
    entity.status = OrderStatusEnum.COMPLETED;
    entity.details = entity.details.map((detail) => {
      if (detail.status === OrderDetailStatusEnum.WAIT_CONFIRM)
        detail.status = OrderDetailStatusEnum.CANCEL;
      if (detail.status === OrderDetailStatusEnum.IN_PROGRESS)
        detail.status = OrderDetailStatusEnum.COMPLETED;
      return detail;
    });

    if (entity.table) {
      entity.table.status = TableStatusEnum.EMPTY;
    }

    return entity;
  }

  list(request: ListOrderQueryDto): Promise<[Order[], number]> {
    const { sort, take, skip, isGetAll, isGetDetails, status } = request;
    const sortObj: any = {};

    if (isEmpty(sort)) {
      sortObj.createdAt = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'paymentReality':
          case 'createdAt':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }

    const findOptions: FindManyOptions<Order> & { isGetAll: number } = {
      order: sortObj,
      take: take,
      skip: skip,
      isGetAll,
    };

    if (isGetDetails) {
      findOptions.relations = {
        details: true,
        customer: true,
        table: true,
        cashier: true,
      };
      findOptions.order.details = {
        createdAt: 'ASC',
      };
    }

    if (!isEmpty(status)) {
      findOptions.where = {
        ...findOptions.where,
        status: In(status),
      };
    }

    return this.findAndCount(findOptions);
  }

  detail(id: number): Promise<Order> {
    return this.findOne({
      where: { id },
      relations: {
        customer: true,
        details: {
          dish: true,
        },
        table: true,
        cashier: true,
      },
      order: {
        details: {
          createdAt: 'ASC',
        },
      },
    });
  }
}
