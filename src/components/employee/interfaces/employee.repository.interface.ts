import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateEmployeeBodyDto } from '../dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from '../dto/request/list-employee.query.dto';
import { UpdateEmployeeBodyDto } from '../dto/request/update-employee.body,dto';
import { Employee } from '../entities/employee.entity';

export interface IEmployeeRepository extends BaseRepository<Employee> {
  createEntity(request: CreateEmployeeBodyDto): Employee;
  updateEntity(entity: Employee, request: UpdateEmployeeBodyDto): Employee;
  list(request: ListEmployeeQueryDto): Promise<[Employee[], number]>;
}
