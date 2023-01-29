import { Role } from '@src/components/role/entities/role.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmployeeStatusEnum } from '../constants/status.enum';

@Entity({ name: 'employees' })
export class Employee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  phone_number: string;

  @Column()
  status: EmployeeStatusEnum;

  @Column()
  password: string;

  @Column()
  date_join: Date;

  @Column()
  date_out: Date;

  @Column()
  role_id: number;

  @Column()
  salary: number;

  @ManyToOne(() => Role, (role) => role.employees)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role: Role;
}
