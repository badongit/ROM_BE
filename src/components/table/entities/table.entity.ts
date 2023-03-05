import { Floor } from '@src/components/floor/entities/floor.entity';
import { Order } from '@src/components/order/entities/order.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TableStatusEnum } from '../constants/status.enum';

@Entity({ name: 'tables' })
export class Table extends BaseEntity {
  @Column()
  code: string;

  @Column()
  status: TableStatusEnum;

  @Column()
  maxPeople: number;

  @Column()
  description: string;

  @Column()
  note: string;

  @Column()
  floorId: number;

  @ManyToOne(() => Floor, (floor) => floor.tables)
  @JoinColumn({ name: 'floor_id', referencedColumnName: 'id' })
  floor: Floor;

  @OneToMany(() => Order, (order) => order.table)
  @JoinColumn({ name: 'id', referencedColumnName: 'table_id' })
  orders: Order[];
}
