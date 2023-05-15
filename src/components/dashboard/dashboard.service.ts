import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ResponseBuilder } from '@src/utils/response-builder';
import { plainToClass } from 'class-transformer';
import { ICustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { IDishRepository } from '../dish/interfaces/dish.repository.interface';
import { EmployeeStatusEnum } from '../employee/constants/status.enum';
import { IEmployeeRepository } from '../employee/interfaces/employee.repository.interface';
import { OrderStatusEnum } from '../order/constants/enums';
import { IOrderRepository } from '../order/interfaces/order.repository.interface';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { DashboardTimeRequestDto } from './dto/request/dashboard-time.request.dto';
import { OrderStatisticsRequestDto } from './dto/request/order-statistics.request.dto';
import { RevenueStatisticsRequestDto } from './dto/request/revenue-statistics.request.dto';
import { SummaryOrderResponseDto } from './dto/request/summary-order.response.dto';
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
}
