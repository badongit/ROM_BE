import { Dish } from '@src/components/dish/entities/dish.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderDetailStatusEnum } from '../constants/enums';
import { Order } from './order.entity';

@Entity({ name: 'order_details' })
export class OrderDetail extends BaseEntity {
  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  status: OrderDetailStatusEnum;

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
