import { Customer } from '@src/components/customer/entities/customer.entity';
import { Employee } from '@src/components/employee/entities/employee.entity';
import { Table } from '@src/components/table/entities/table.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderStatusEnum } from '../constants/status.enum';
import { OrderTypeEnum } from '../constants/type.enum';
import { OrderDetail } from './order-details.entity';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @Column()
  code: string;

  @Column()
  payment_reality: number;

  @Column()
  payment_method: number;

  @Column()
  point_used: number;

  @Column()
  status: OrderStatusEnum;

  @Column()
  type: OrderTypeEnum;

  @Column()
  note: string;

  @Column()
  table_id: number;

  @Column()
  customer_id: number;

  @Column()
  cashier_id: number;

  @Column()
  waiting_ticket: string;

  @ManyToOne(() => Table, (table) => table.orders)
  @JoinColumn({
    name: 'table_id',
    referencedColumnName: 'id',
  })
  table: Table;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    cascade: ['insert'],
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
