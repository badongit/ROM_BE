import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from '@src/repositories/order.repository';
import { FloorRepository } from '@src/repositories/floor.repository';
import { CustomerRepository } from '@src/repositories/customer.repository';
import { TableRepository } from '@src/repositories/table.repository';
import { Customer } from '../customer/entities/customer.entity';
import { DishRepository } from '@src/repositories/dish.repository';
import { Dish } from '../dish/entities/dish.entity';
import { Table } from '../table/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, Table, Dish])],
  providers: [
    OrderGateway,
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
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
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
})
export class OrderModule {}
