import { Inject, Injectable } from '@nestjs/common';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ResponseBuilder } from '@src/utils/response-builder';
import { ICustomerRepository } from '../customer/interfaces/customer.repository.interface';
import { IDishRepository } from '../dish/interfaces/dish.repository.interface';
import { EmployeeStatusEnum } from '../employee/constants/status.enum';
import { IEmployeeRepository } from '../employee/interfaces/employee.repository.interface';
import { OrderStatusEnum } from '../order/constants/enums';
import { IOrderRepository } from '../order/interfaces/order.repository.interface';
import { ITableRepository } from '../table/interfaces/table.repository.interface';
import { DashboardTimeRequestDto } from './dto/dashboard-time.request.dto';
import { SummaryOrderResponseDto } from './dto/summary-order.response.dto';
import { SyntheticResponseDto } from './dto/synthetic.response.dto';
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
}
