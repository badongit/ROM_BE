import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from '@src/repositories/employee.repository';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { OrderRepository } from '@src/repositories/order.repository';
import { Employee } from '../employee/entities/employee.entity';
import { Order } from '../order/entities/order.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Table } from '../table/entities/table.entity';
import { Dish } from '../dish/entities/dish.entity';
import { TableRepository } from '@src/repositories/table.repository';
import { DishRepository } from '@src/repositories/dish.repository';
import { OrderDetailRepository } from '@src/repositories/order-detail.repository';
import { OrderDetail } from '../order/entities/order-details.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Order,
      Customer,
      Table,
      Dish,
      OrderDetail,
      Role,
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: 'IDashboardService',
      useClass: DashboardService,
    },
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepository,
    },
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'IOrderDetailRepository',
      useClass: OrderDetailRepository,
    },
    {
      provide: 'ITableRepository',
      useClass: TableRepository,
    },
    {
      provide: 'IDishRepository',
      useClass: DishRepository,
    },
  ],
  exports: [
    {
      provide: 'IDashboardService',
      useClass: DashboardService,
    },
  ],
})
export class DashboardModule {}
