import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeStatusEnum } from '@src/components/employee/constants/status.enum';
import { CreateEmployeeBodyDto } from '@src/components/employee/dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from '@src/components/employee/dto/request/list-employee.query.dto';
import { UpdateEmployeeBodyDto } from '@src/components/employee/dto/request/update-employee.body,dto';
import { Employee } from '@src/components/employee/entities/employee.entity';
import { IEmployeeRepository } from '@src/components/employee/interfaces/employee.repository.interface';
import { Role } from '@src/components/role/entities/role.entity';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { isDefined, isEmpty } from 'class-validator';
import { Repository } from 'typeorm';
import { SortEnum } from '@src/constants/enum/sort.enum';
import { EmployeeResponseDto } from '@src/components/employee/dto/response/employee.response.dto';
import { ChangeStatusEmployeeBodyDto } from '@src/components/employee/dto/request/change-employee.body.dto';
import { UpdateEmployeeByAdminBodyDto } from '@src/components/employee/dto/request/update-employee-by-admin.body.dto';
import { UpdateEmployeeByManagerBodyDto } from '@src/components/employee/dto/request/update-employee-by-manager.body.dto';

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

  async list(
    request: ListEmployeeQueryDto,
  ): Promise<[EmployeeResponseDto[], number]> {
    const {
      sort,
      take,
      skip,
      keyword,
      role_id,
      status,
      date_join_from,
      date_join_to,
      date_out_from,
      date_out_to,
    } = request;

    const query = this.employeeRepository
      .createQueryBuilder('e')
      .select([
        'e.id AS id',
        'e.name AS name',
        'e.code AS code',
        'e.phone_number AS phone_number',
        'e.status AS status',
        'e.date_join AS date_join',
        'e.date_out AS date_out',
        'e.role_id AS role_id',
        'e.salary AS salary',
        `JSON_BUILD_OBJECT('id', r.id, 'name', r.name, 'code', r.code) AS role`,
      ])
      .innerJoin(Role, 'r', 'r.id = e.role_id');

    if (!isEmpty(keyword)) {
      query.andWhere(
        `(
        LOWER(UNACCENT(e.name)) ILIKE UNACCENT(:keyword) ESCAPE '\\'
        OR LOWER(UNACCENT(e.code)) ILIKE UNACCENT(:keyword) ESCAPE '\\'
        OR LOWER(UNACCENT(e.phone_number)) ILIKE UNACCENT(:keyword) ESCAPE '\\'
      )`,
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    if (role_id) {
      query.andWhere('e.role_id = :role_id', { role_id });
    }

    if (isDefined(status)) {
      query.andWhere('e.status = :status', { status });
    }

    if (date_join_from) {
      query.andWhere('e.date_join::DATE >= :date_join_from::DATE', {
        date_join_from,
      });
    }

    if (date_join_to) {
      query.andWhere('e.date_join::DATE <= :date_join_to::DATE', {
        date_join_to,
      });
    }

    if (date_out_from) {
      query.andWhere('e.date_out::DATE >= :date_out_from::DATE', {
        date_out_from,
      });
    }

    if (date_out_to) {
      query.andWhere('e.date_out::DATE <= :date_out_to::DATE', {
        date_out_to,
      });
    }

    if (isEmpty(sort)) {
      query.orderBy('created_at', SortEnum.DESC);
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'code':
          case 'status':
          case 'price':
          case 'category_id':
          case 'created_at':
            query.addOrderBy(item.column, item.order);
            break;
        }
      });
    }

    const employees = await query.skip(skip).take(take).getRawMany();
    const count = await query.getCount();

    return [employees, count];
  }

  changeStatus(
    entity: Employee,
    request: ChangeStatusEmployeeBodyDto,
  ): Employee {
    switch (request.status) {
      case EmployeeStatusEnum.WORKING:
        entity.date_join = new Date();
        entity.date_out = null;
        break;
      case EmployeeStatusEnum.LEAVE:
        entity.date_out = new Date();
        break;
    }
    entity.status = request.status;
    return entity;
  }

  updateEntityByManager(
    entity: Employee,
    request: UpdateEmployeeByManagerBodyDto,
  ): Employee {
    const { code, date_join, date_out } = request;
    const newEntity = this.updateEntity(entity, request);
    newEntity.code = code;
    newEntity.date_join = date_join;
    newEntity.date_out = date_out;

    return entity;
  }

  updateEntityByAdmin(
    entity: Employee,
    request: UpdateEmployeeByAdminBodyDto,
  ): Employee {
    const { role_id, salary } = request;
    const newEntity = this.updateEntityByManager(entity, request);
    newEntity.role_id = role_id;
    newEntity.salary = salary;

    return newEntity;
  }
}
