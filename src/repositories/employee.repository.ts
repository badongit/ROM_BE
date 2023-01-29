import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeStatusEnum } from '@src/components/employee/constants/status.enum';
import { CreateEmployeeBodyDto } from '@src/components/employee/dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from '@src/components/employee/dto/request/list-employee.query.dto';
import { UpdateEmployeeBodyDto } from '@src/components/employee/dto/request/update-employee.body,dto';
import { Employee } from '@src/components/employee/entities/employee.entity';
import { IEmployeeRepository } from '@src/components/employee/interfaces/employee.repository.interface';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { Repository } from 'typeorm';

export class EmployeeRepository
  extends BaseRepository<Employee>
  implements IEmployeeRepository
{
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {
    super(employeeRepository);
  }
  createEntity(request: CreateEmployeeBodyDto): Employee {
    const { name, code, phone_number, password, date_join, salary, role_id } =
      request;
    const entity = new Employee();
    entity.name = name;
    entity.code = code;
    entity.phone_number = phone_number;
    entity.password = password;
    entity.status = EmployeeStatusEnum.WORKING;
    entity.date_join = date_join || new Date();
    entity.salary = salary || 0;
    entity.role_id = role_id;

    return entity;
  }
  updateEntity(entity: Employee, request: UpdateEmployeeBodyDto): Employee {
    const { name, phone_number, password } = request;

    entity.name = name;
    entity.phone_number = phone_number;
    entity.password = password;

    return entity;
  }

  list(request: ListEmployeeQueryDto): Promise<[Employee[], number]> {
    throw new Error('Method not implemented.');
  }
}
