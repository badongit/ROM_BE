import { Dish } from '@src/components/dish/entities/dish.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column()
  active: boolean;

  @Column()
  description: string;

  @OneToMany(() => Dish, (dish) => dish.category, { cascade: ['soft-remove'] })
  dishes: Dish[];
}
