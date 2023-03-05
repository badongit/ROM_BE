import { Order } from '@src/components/order/entities/order.entity';
import { Role } from '@src/components/role/entities/role.entity';
import { BaseEntity } from '@src/core/entities/base.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { EmployeeStatusEnum } from '../constants/status.enum';
import * as bcryptJs from 'bcryptjs';
@Entity({ name: 'employees' })
export class Employee extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  phoneNumber: string;

  @Column()
  status: EmployeeStatusEnum;

  @Column()
  password: string;

  @Column()
  dateJoin: Date;

  @Column()
  dateOut: Date;

  @Column()
  roleId: number;

  @Column()
  salary: number;

  @ManyToOne(() => Role, (role) => role.employees, { eager: true })
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id',
  })
  role: Role;

  @OneToMany(() => Order, (order) => order.cashier)
  @JoinColumn({ name: 'id', referencedColumnName: 'cashier_id' })
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const saltOrRounds = 10;
    this.password = bcryptJs.hashSync(this.password, saltOrRounds);
  }

  validatePassword(password: string): boolean {
    return bcryptJs.compareSync(password, this.password);
  }
}
