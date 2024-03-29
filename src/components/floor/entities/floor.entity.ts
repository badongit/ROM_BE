import { Table } from '@src/components/table/entities/table.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'floors' })
export class Floor extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Table, (table) => table.floor, {
    cascade: ['soft-remove', 'remove'],
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'floor_id' })
  tables: Table[];
}
