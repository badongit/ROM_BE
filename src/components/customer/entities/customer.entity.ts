import { Order } from '@src/components/order/entities/order.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  point: number;

  @OneToMany(() => Order, (order) => order.customer)
  @JoinColumn({ name: 'id', referencedColumnName: 'customer_id' })
  orders: Order[];
}
