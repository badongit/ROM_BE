import { Category } from '@src/components/category/entities/category.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
  category_id: number;

  @ManyToOne(() => Category, (category) => category.dishes)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;
}
