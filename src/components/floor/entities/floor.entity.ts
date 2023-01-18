import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Floor extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;
}
