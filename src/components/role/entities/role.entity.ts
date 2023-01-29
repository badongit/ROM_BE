import { Employee } from '@src/components/employee/entities/employee.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @OneToMany(() => Employee, (employee) => employee.role)
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'role_id',
  })
  employees: Employee[];
}
