import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phone_number: string;

  @Column()
  point: number;
}
