import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column()
  active: boolean;

  @Column()
  description: string;
}
