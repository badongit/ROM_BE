import { Table } from '@src/components/table/entities/table.entity';
import { BaseEntity } from 'src/core/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'floors' })
export class Floor extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @OneToMany(() => Table, (table) => table.floor)
  tables: Table[];
}
