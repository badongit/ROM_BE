import { Inject, Injectable } from '@nestjs/common';
import AppDataSource from '@src/configs/database.config';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { isEmpty, map, uniq } from 'lodash';
import { DataSource, FindOptionsWhere, In, Like, Not } from 'typeorm';
import { CreateCustomerBodyDto } from '../customer/dto/request/create-customer.body.dto';
import { Customer } from '../customer/entities/customer.entity';
import { ICustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { IDishRepository } from '../dish/interfaces/dish.repository.interface';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { UpdateOrderRequestDto } from './dto/request/update-order.request.dto';
import { DetailOrderResponseDto } from './dto/response/detail-order.response.dto';
import { OrderResponseDto } from './dto/response/order.response.dto';
import { OrderDetail } from './entities/order-details.entity';
import { Order } from './entities/order.entity';
import { IOrderDetailRepository } from './interfaces/order-detail.repository.interface';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { IOrderService } from './interfaces/order.service.interface';
import { ListOrderQueryDto } from './dto/request/list-order.query.dto';
import { TableStatusEnum } from '../table/constants/status.enum';
import { OrderStatusEnum, OrderTypeEnum } from './constants/enums';
import { Table } from '../table/entities/table.entity';
@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,

    @Inject('IOrderDetailRepository')
    private readonly orderDetailRepository: IOrderDetailRepository,

    @Inject('ITableRepository')
    private readonly tableRepository: ITableRepository,

    @Inject('IDishRepository')
    private readonly dishRepository: IDishRepository,

    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    request: CreateOrderRequestDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>> {
    const [responseError, , customer] = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const { tableId, status } = request;

    const orderEntity = await this.orderRepository.createEntity(request);
    if (customer) {
      orderEntity.customer = customer;
    }

    let order: Order = null;
    let error: Error = null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      order = await queryRunner.manager.save(orderEntity);
      if (tableId) {
        await queryRunner.manager.update(
          Table,
          { id: tableId },
          {
            status:
              status === OrderStatusEnum.WAIT_CONFIRM
                ? TableStatusEnum.RESERVED
                : TableStatusEnum.SERVING,
          },
        );
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      error = error;
    } finally {
      await queryRunner.release();
    }

    if (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(MessageEnum.ERROR_HAPPENED)
        .build();
    }

    const dataReturn = plainToClass(DetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async update(
    request: UpdateOrderRequestDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>> {
    const [responseError, orderExisted, customer] =
      await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const findDetailConditions: FindOptionsWhere<OrderDetail> = {
      orderId: request.id,
    };

    const detailIds: number[] = [];

    for (const detail of request.details) {
      if (detail.id) detailIds.push(detail.id);
    }

    if (!isEmpty(detailIds)) {
      findDetailConditions.id = Not(In(detailIds));
    }

    const orderDetails = await this.orderDetailRepository.find({
      where: findDetailConditions,
    });

    const orderEntity = await this.orderRepository.updateEntity(
      orderExisted,
      request,
    );

    if (customer) {
      orderEntity.customer = customer;
    }

    let order: Order = null;
    let error: Error = null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.remove(OrderDetail, orderDetails);

      order = await queryRunner.manager.save<Order>(orderEntity);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      error = err;
    } finally {
      await queryRunner.release();
    }
    if (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(MessageEnum.ERROR_HAPPENED)
        .build();
    }

    const dataReturn = plainToClass(DetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  private async validateBeforeSave(
    request: any,
  ): Promise<[ResponsePayload<any>, Order, Customer]> {
    const { id, customerPhoneNumber, customerName, tableId, details } = request;
    let order: Order = null;
    let customer: Customer = null;

    if (id) {
      order = await this.orderRepository.findOne({
        where: { id },
      });

      if (!order)
        return [
          new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.ORDER_NOT_FOUND,
          ).toResponse(),
          order,
          customer,
        ];
    }

    if (customerPhoneNumber) {
      customer = await this.customerRepository.findOne({
        where: { phoneNumber: Like(customerPhoneNumber) },
      });

      if (!customer && customerName) {
        const request = new CreateCustomerBodyDto();
        request.name = customerName;
        request.phoneNumber = customerPhoneNumber;
        customer = this.customerRepository.createEntity(request);
      }
    }

    if (tableId) {
      const table = await this.tableRepository.findById(tableId);
      if (!table)
        return [
          new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.TABLE_NOT_FOUND,
          ).toResponse(),
          order,
          customer,
        ];

      if (table.status !== TableStatusEnum.EMPTY) {
        return [
          new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.TABLE_STATUS_INVALID,
          ).toResponse(),
          order,
          customer,
        ];
      }
    }

    if (!isEmpty(details)) {
      const dishIds = uniq(map(details, 'dishId'));

      const dishes = await this.dishRepository.find({
        where: { id: In(dishIds) },
      });

      if (dishes.length !== dishIds.length)
        return [
          new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.DISH_NOT_FOUND,
          ).toResponse(),
          order,
          customer,
        ];
    }

    return [null, order, customer];
  }

  async list(
    request: ListOrderQueryDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto>> {
    const [orders, count] = await this.orderRepository.list(request);

    const dataReturn = plainToClass(DetailOrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder({
      items: dataReturn,
      meta: { page: request.page, total: count },
    }).build();
  }
}
