import { Floor } from '@src/components/floor/entities/floor.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TableStatusEnum } from '../constants/status.enum';

@Entity({ name: 'tables' })
export class Table extends BaseEntity {
  @Column()
  code: string;

  @Column()
  status: TableStatusEnum;

  @Column()
  max_people: number;

  @Column()
  description: string;

  @Column()
  note: string;

  @Column()
  floor_id: number;

  @ManyToOne(() => Floor, (floor) => floor.tables)
  @JoinColumn({ name: 'floor_id', referencedColumnName: 'id' })
  floor: Floor;
}
