import { Floor } from '@src/components/floor/entities/floor.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'tables' })
export class Table extends BaseEntity {
  @Column()
  code: string;

  @Column()
  status: number;

  @Column()
  max_people: number;

  @Column()
  description: string;

  @Column()
  note: string;

  @Column()
  floor_id: number;

  @ManyToOne(() => Floor, (floor) => floor.tables)
  floor: Floor;
}
