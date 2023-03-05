import { Category } from '@src/components/category/entities/category.entity';
import { OrderDetail } from '@src/components/order/entities/order-details.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'dishes' })
export class Dish extends BaseEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  status: number;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.dishes)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.dish)
  @JoinColumn({ name: 'id', referencedColumnName: 'dish_id' })
  orderDetails: OrderDetail[];
}
