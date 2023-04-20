import { Customer } from '@src/components/customer/entities/customer.entity';
import { Employee } from '@src/components/employee/entities/employee.entity';
import { Table } from '@src/components/table/entities/table.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  PaymentMethodEnum,
  OrderStatusEnum,
  OrderTypeEnum,
} from '../constants/enums';
import { OrderDetail } from './order-details.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @Column()
  code: string;

  @Column()
  paymentReality: number;

  @Column()
  paymentMethod: PaymentMethodEnum;

  @Column()
  pointUsed: number;

  @Column()
  status: OrderStatusEnum;

  @Column()
  type: OrderTypeEnum;

  @Column()
  note: string;

  @Column()
  tableId: number;

  @Column()
  customerId: number;

  @Column()
  cashierId: number;

  @Column()
  waitingTicket: string;

  @ManyToOne(() => Table, (table) => table.orders, {
    cascade: ['update'],
  })
  @JoinColumn({
    name: 'table_id',
    referencedColumnName: 'id',
  })
  table: Table;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  customer: Customer;

  @ManyToOne(() => Employee, (employee) => employee.orders)
  @JoinColumn({ name: 'cashier_id', referencedColumnName: 'id' })
  cashier: Employee;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'order_id' })
  details: OrderDetail[];
}
