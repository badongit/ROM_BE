import { BaseRepository } from '@src/core/repositories/base.repository';
import { ChangeStatusEmployeeBodyDto } from '../dto/request/change-employee.body.dto';
import { CreateEmployeeBodyDto } from '../dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from '../dto/request/list-employee.query.dto';
import { UpdateEmployeeByAdminBodyDto } from '../dto/request/update-employee-by-admin.body.dto';
import { UpdateEmployeeByManagerBodyDto } from '../dto/request/update-employee-by-manager.body.dto';
import { UpdateEmployeeBodyDto } from '../dto/request/update-employee.body,dto';
import { EmployeeResponseDto } from '../dto/response/employee.response.dto';
import { Employee } from '../entities/employee.entity';

export interface IEmployeeRepository extends BaseRepository<Employee> {
  createEntity(request: CreateEmployeeBodyDto): Employee;
  updateEntity(entity: Employee, request: UpdateEmployeeBodyDto): Employee;
  list(request: ListEmployeeQueryDto): Promise<[EmployeeResponseDto[], number]>;
  changeStatus(
    entity: Employee,
    request: ChangeStatusEmployeeBodyDto,
  ): Employee;
  updateEntityByManager(
    entity: Employee,
    request: UpdateEmployeeByManagerBodyDto,
  ): Employee;
  updateEntityByAdmin(
    entity: Employee,
    request: UpdateEmployeeByAdminBodyDto,
  ): Employee;
}
