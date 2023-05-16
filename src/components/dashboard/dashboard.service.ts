import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { has, isEmpty, keyBy, map } from 'lodash';
import { In } from 'typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { ICustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { Dish } from '../dish/entities/dish.entity';
import { IDishRepository } from '../dish/interfaces/dish.repository.interface';
import { EmployeeStatusEnum } from '../employee/constants/status.enum';
import { IEmployeeRepository } from '../employee/interfaces/employee.repository.interface';
import { OrderStatusEnum } from '../order/constants/enums';
import { IOrderDetailRepository } from '../order/interfaces/order-detail.repository.interface';
import { IOrderRepository } from '../order/interfaces/order.repository.interface';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { DashboardTimeRequestDto } from './dto/request/dashboard-time.request.dto';
import { OrderStatisticsRequestDto } from './dto/request/order-statistics.request.dto';
import { RevenueStatisticsRequestDto } from './dto/request/revenue-statistics.request.dto';
import { SummaryOrderResponseDto } from './dto/request/summary-order.response.dto';
import { CustomerOrderStatisticsResponseDto } from './dto/response/customer-order-statistics.response.dto';
import { DishOrderStatisticsResponseDto } from './dto/response/dish-order-statistics.response.dto';
import { OrderStatisticsResponseDto } from './dto/response/order-statistics.response.dto';
import { RevenueStatisticsResponseDto } from './dto/response/revenue-statistics.response.dto';
import { SyntheticResponseDto } from './dto/response/synthetic.response.dto';
import { IDashboardService } from './interfaces/dashboard.service.interface';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,

    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,

    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,

    @Inject('IOrderDetailRepository')
    private readonly orderDetailRepository: IOrderDetailRepository,

    @Inject('IDishRepository')
    private readonly dishRepository: IDishRepository,

    @Inject('ITableRepository')
    private readonly tableRepository: ITableRepository,
  ) {}

  async synthetic(): Promise<ResponsePayload<SyntheticResponseDto>> {
    const totalEmployee = await this.employeeRepository.count({
      where: { status: EmployeeStatusEnum.WORKING },
    });

    const totalCustomer = await this.customerRepository.count();
    const totalDish = await this.dishRepository.count();
    const totalTable = await this.tableRepository.count();

    const dataReturn = {
      totalCustomer,
      totalEmployee,
      totalDish,
      totalTable,
    };

    return new ResponseBuilder(dataReturn).build();
  }

  async summaryOrder(
    request: DashboardTimeRequestDto,
  ): Promise<ResponsePayload<SummaryOrderResponseDto>> {
    const countCompleted = await this.orderRepository.count({
      where: { status: OrderStatusEnum.COMPLETED },
    });
    const countCanceled = await this.orderRepository.count({
      where: { status: OrderStatusEnum.CANCEL },
    });

    return new ResponseBuilder({ countCompleted, countCanceled }).build();
  }

  async revenueStatistics(
    request: RevenueStatisticsRequestDto,
  ): Promise<ResponsePayload<RevenueStatisticsResponseDto>> {
    const data = await this.orderRepository.revenueStatistics(request);

    const dataReturn = plainToClass(RevenueStatisticsResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return new ResponseBuilder(dataReturn).build();
  }

  async orderStatistics(
    request: OrderStatisticsRequestDto,
  ): Promise<ResponsePayload<OrderStatisticsResponseDto>> {
    const data = await this.orderRepository.orderStatistics(request);

    const dataReturn = plainToClass(OrderStatisticsResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }

  async dishOrderStatistics(
    request: PaginationQueryDto,
  ): Promise<ResponsePayload<any>> {
    const data = await this.orderDetailRepository.dishOrderStatistics(request);

    const dishIds = map(data, 'dishid');

    let dishes: Dish[] = [];
    if (!isEmpty(dishIds))
      dishes = await this.dishRepository.find({
        where: { id: In(dishIds) },
        relations: {
          category: true,
        },
        withDeleted: true,
      });
    const dishMap = keyBy(dishes, 'id');

    data.forEach((item) => {
      if (has(dishMap, item.dishid)) item.dish = dishMap[item.dishid];
    });

    const dataReturn = plainToClass(DishOrderStatisticsResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }

  async customerOrderStatistics(
    request: PaginationQueryDto,
  ): Promise<ResponsePayload<any>> {
    const data = await this.orderRepository.customerOrderStatistics(request);

    const customerIds = map(data, 'customerid');

    let customers: Customer[] = [];
    if (!isEmpty(customerIds))
      customers = await this.customerRepository.find({
        where: { id: In(customerIds) },
        withDeleted: true,
      });
    const customerMap = keyBy(customers, 'id');

    data.forEach((item) => {
      if (has(customerMap, item.customerid))
        item.customer = customerMap[item.customerid];
    });

    const dataReturn = plainToClass(CustomerOrderStatisticsResponseDto, data, {
      excludeExtraneousValues: true,
    });
    return new ResponseBuilder(dataReturn).build();
  }
}
