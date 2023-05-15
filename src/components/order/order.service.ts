import { Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { RoleEnum } from '@src/constants/enum/role.enum';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { amountToPoint, discountAmount } from '@src/utils/common';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { add, isEmpty, map, multiply, subtract, uniq } from 'lodash';
import { DataSource, FindOptionsWhere, In, Like, Not } from 'typeorm';
import { CreateCustomerBodyDto } from '../customer/dto/request/create-customer.body.dto';
import { Customer } from '../customer/entities/customer.entity';
import { ICustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { IDishRepository } from '../dish/interfaces/dish.repository.interface';
import { IEmployeeRepository } from '../employee/interfaces/employee.repository.interface';
import { TableStatusEnum } from '../table/constants/status.enum';
import { Table } from '../table/entities/table.entity';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { ROLE_ALLOW_COMPLETED_ORDER } from './constants';
import { OrderDetailStatusEnum, OrderStatusEnum } from './constants/enums';
import { ChangeStatusOrderDetailRequestDto } from './dto/request/change-status-order-detail.request.dto';
import { CompleteOrderRequestDto } from './dto/request/complete-order.request.dto';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { ListOrderQueryDto } from './dto/request/list-order.query.dto';
import { UpdateOrderRequestDto } from './dto/request/update-order.request.dto';
import { DetailOrderResponseDto } from './dto/response/detail-order.response.dto';
import { OrderDetailResponseDto } from './dto/response/order-detail.response.dto';
import { OrderDetail } from './entities/order-details.entity';
import { Order } from './entities/order.entity';
import { IOrderDetailRepository } from './interfaces/order-detail.repository.interface';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { IOrderService } from './interfaces/order.service.interface';
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

    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,

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

  async detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>> {
    const order = await this.orderRepository.detail(request.id);

    if (!order) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.ORDER_NOT_FOUND,
      ).toResponse();
    }

    const dataReturn = plainToClass(DetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async confirmOrder(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>> {
    const [responseError, orderExisted] = await this.validateBeforeSave(
      request,
    );

    if (responseError) {
      return responseError;
    }

    const confirmStatus = OrderStatusEnum.IN_PROGRESS;

    if (!this.validateOrderStatus(orderExisted.status, confirmStatus)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.STATUS_INVALID,
      ).toResponse();
    }

    orderExisted.status = confirmStatus;
    if (orderExisted.table) {
      orderExisted.table.status = TableStatusEnum.SERVING;
    }
    const order = await this.orderRepository.save(orderExisted);

    const dataReturn = plainToClass(DetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async cancelOrder(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>> {
    const [responseError, orderExisted] = await this.validateBeforeSave(
      request,
    );

    if (responseError) {
      return responseError;
    }

    const cancelStatus = OrderStatusEnum.CANCEL;

    if (!this.validateOrderStatus(orderExisted.status, cancelStatus)) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.STATUS_INVALID,
      ).toResponse();
    }

    orderExisted.status = cancelStatus;
    if (orderExisted.table) {
      orderExisted.table.status = TableStatusEnum.EMPTY;
    }

    const order = await this.orderRepository.save(orderExisted);

    const dataReturn = plainToClass(DetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async changeStatusOrderDetail(
    request: ChangeStatusOrderDetailRequestDto,
  ): Promise<ResponsePayload<OrderDetailResponseDto | any>> {
    const orderDetailExisted = await this.orderDetailRepository.findById(
      request.id,
    );

    if (!orderDetailExisted) {
      return new ApiError(
        ResponseCodeEnum.NOT_FOUND,
        MessageEnum.ORDER_DETAIL_NOT_FOUND,
      ).toResponse();
    }

    if (
      !this.validateOrderDetailStatus(orderDetailExisted.status, request.status)
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.STATUS_INVALID,
      ).toResponse();
    }

    orderDetailExisted.status = request.status;
    const orderDetail = await this.orderDetailRepository.save(
      orderDetailExisted,
    );

    const dataReturn = plainToClass(OrderDetailResponseDto, orderDetail, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }

  async completeOrder(
    request: CompleteOrderRequestDto,
  ): Promise<ResponsePayload<DetailOrderResponseDto | any>> {
    const { pointUsed } = request;
    const [responseError, orderExisted, customer] =
      await this.validateBeforeSave(request);

    if (responseError) return responseError;

    if (
      !this.validateOrderStatus(orderExisted.status, OrderStatusEnum.COMPLETED)
    ) {
      return new ApiError(
        ResponseCodeEnum.BAD_REQUEST,
        MessageEnum.STATUS_INVALID,
      ).toResponse();
    }

    const orderEntity = this.orderRepository.completeEntity(
      orderExisted,
      request,
    );

    let amount = 0;
    orderEntity.details.forEach((detail) => {
      if (detail.status === OrderDetailStatusEnum.COMPLETED)
        amount = add(amount, multiply(detail.quantity, detail.price));
    });

    if (customer) {
      const pointReceive = amountToPoint(amount);
      const { amount: remainAmount, point: remainPoint } = discountAmount(
        amount,
        pointUsed ?? 0,
      );

      amount = remainAmount;
      // số điểm mới = số điểm cũ - (số điểm sử dụng - số điểm còn lại) + số điểm nhận được từ đơn hàng
      customer.point = add(
        subtract(customer.point, subtract(pointUsed, remainPoint)),
        pointReceive,
      );
      orderEntity.customer = customer;
    }

    orderEntity.paymentReality = amount;

    const order = await this.orderRepository.save(orderEntity);
    const dataReturn = plainToClass(DetailOrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  private async validateBeforeSave(
    request: any,
  ): Promise<[ResponsePayload<any>, Order, Customer]> {
    let order: Order = null;
    let customer: Customer = null;

    try {
      const {
        id,
        customerPhoneNumber,
        customerName,
        tableId,
        details,
        cashierId,
        waitingTicket,
      } = request;

      if (id) {
        order = await this.orderRepository.findOne({
          where: { id },
          order: {
            details: {
              createdAt: 'ASC',
            },
          },
          relations: {
            details: true,
            customer: true,
            table: true,
          },
        });

        if (!order)
          throw new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.ORDER_NOT_FOUND,
          ).toResponse();

        if (cashierId) {
          const employee = await this.employeeRepository.findOne({
            where: { id: cashierId },
            relations: { role: true },
          });

          if (!employee) {
            throw new ApiError(
              ResponseCodeEnum.NOT_FOUND,
              MessageEnum.EMPLOYEE_NOT_FOUND,
            ).toResponse();
          }

          if (!ROLE_ALLOW_COMPLETED_ORDER.includes(employee.role.code)) {
            throw new ApiError(
              ResponseCodeEnum.BAD_REQUEST,
              MessageEnum.ROLE_INVALID,
            ).toResponse();
          }

          order.cashier = employee;
        }
      }

      if (waitingTicket) {
        const orderExisted = await this.orderRepository.findOne({
          where: { waitingTicket, status: OrderStatusEnum.IN_PROGRESS },
        });

        if (orderExisted) {
          throw new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.WAITING_TICKET_BEING_USED,
          ).toResponse();
        }
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

        if (request.pointUsed && request.pointUsed > customer.point) {
          throw new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.POINT_NOT_ENOUGH,
          ).toResponse();
        }
      }

      if (tableId) {
        const table = await this.tableRepository.findById(tableId);
        if (!table)
          throw new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.TABLE_NOT_FOUND,
          ).toResponse();

        if (table.status !== TableStatusEnum.EMPTY) {
          throw new ApiError(
            ResponseCodeEnum.BAD_REQUEST,
            MessageEnum.TABLE_STATUS_INVALID,
          ).toResponse();
        }
      }

      if (!isEmpty(details)) {
        const dishIds = uniq(map(details, 'dishId'));

        const dishes = await this.dishRepository.find({
          where: { id: In(dishIds) },
        });

        if (dishes.length !== dishIds.length)
          throw new ApiError(
            ResponseCodeEnum.NOT_FOUND,
            MessageEnum.DISH_NOT_FOUND,
          ).toResponse();
      }

      return [null, order, customer];
    } catch (error) {
      return [error, order, customer];
    }
  }

  private validateOrderStatus(
    oldStatus: OrderStatusEnum,
    newStatus: OrderStatusEnum,
  ): boolean {
    switch (newStatus) {
      case OrderStatusEnum.WAIT_CONFIRM:
        return false;
      case OrderStatusEnum.IN_PROGRESS:
        return oldStatus === OrderStatusEnum.WAIT_CONFIRM;
      case OrderStatusEnum.COMPLETED:
        return oldStatus === OrderStatusEnum.IN_PROGRESS;
      case OrderStatusEnum.CANCEL:
        return oldStatus === OrderStatusEnum.WAIT_CONFIRM;
      default:
        return false;
    }
  }

  private validateOrderDetailStatus(
    oldStatus: OrderDetailStatusEnum,
    newStatus: OrderDetailStatusEnum,
  ): boolean {
    switch (newStatus) {
      case OrderDetailStatusEnum.WAIT_CONFIRM:
        return false;
      case OrderDetailStatusEnum.IN_PROGRESS:
        return oldStatus === OrderDetailStatusEnum.WAIT_CONFIRM;
      case OrderDetailStatusEnum.COMPLETED:
        return oldStatus === OrderDetailStatusEnum.IN_PROGRESS;
      case OrderDetailStatusEnum.CANCEL:
        return oldStatus === OrderDetailStatusEnum.WAIT_CONFIRM;
      default:
        return false;
    }
  }
}
