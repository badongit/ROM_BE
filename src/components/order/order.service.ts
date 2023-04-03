import { Inject, Injectable } from '@nestjs/common';
import { MessageEnum } from '@src/constants/enum/message.enum';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ApiError } from '@src/utils/api-error';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { isEmpty, map, uniq } from 'lodash';
import { In } from 'typeorm';
import { CreateCustomerBodyDto } from '../customer/dto/request/create-customer.body.dto';
import { Customer } from '../customer/entities/customer.entity';
import { ICustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { IDishRepository } from '../dish/interfaces/dish.repository.interface';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { CreateOrderRequestDto } from './dto/request/create-order.request.dto';
import { OrderResponseDto } from './dto/response/order.response.dto';
import { Order } from './entities/order.entity';
import { IOrderRepository } from './interfaces/order.repository.interface';
import { IOrderService } from './interfaces/order.service.interface';
@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,

    @Inject('ITableRepository')
    private readonly tableRepository: ITableRepository,

    @Inject('IDishRepository')
    private readonly dishRepository: IDishRepository,

    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async create(
    request: CreateOrderRequestDto,
  ): Promise<ResponsePayload<OrderResponseDto>> {
    const [responseError, , customer] = await this.validateBeforeSave(request);

    if (responseError) {
      return responseError;
    }

    const orderEntity = await this.orderRepository.createEntity(request);
    if (customer) {
      orderEntity.customer = customer;
    }
    const order = await this.orderRepository.save(orderEntity);

    const dataReturn = plainToClass(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async validateBeforeSave(
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
        where: { phoneNumber: customerPhoneNumber },
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
}
