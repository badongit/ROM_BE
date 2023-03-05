import { Dish } from '@src/components/dish/entities/dish.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderDetailEnum } from '../constants/status.enum';
import { Order } from './order.entity';

@Entity({ name: 'orderDetails' })
export class OrderDetail extends BaseEntity {
  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  status: OrderDetailEnum;

  @Column()
  note: string;

  @Column()
  orderId: number;

  @Column()
  dishId: number;

  @ManyToOne(() => Order, (order) => order.details)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order: Order;

  @ManyToOne(() => Dish, (dish) => dish.orderDetails)
  @JoinColumn({ name: 'dish_id', referencedColumnName: 'id' })
  dish: Dish;
}
