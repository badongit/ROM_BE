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
    const { name, code, phoneNumber, password, dateJoin, salary, roleId } =
      request;
    const entity = new Employee();
    entity.name = name;
    entity.code = code;
    entity.phoneNumber = phoneNumber;
    entity.password = password;
    entity.status = EmployeeStatusEnum.WORKING;
    entity.dateJoin = dateJoin || new Date();
    entity.salary = salary || 0;
    entity.roleId = roleId;

    return entity;
  }
  updateEntity(entity: Employee, request: UpdateEmployeeBodyDto): Employee {
    const { name, phoneNumber, password } = request;

    entity.name = name;
    entity.phoneNumber = phoneNumber;
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
      roleId,
      status,
      dateJoinFrom,
      dateJoinTo,
      dateOutFrom,
      dateOutTo,
    } = request;

    const query = this.employeeRepository
      .createQueryBuilder('e')
      .select([
        'e.id AS id',
        'e.name AS name',
        'e.code AS code',
        'e.phoneNumber AS phoneNumber',
        'e.status AS status',
        'e.dateJoin AS dateJoin',
        'e.dateOut AS dateOut',
        'e.roleId AS roleId',
        'e.salary AS salary',
        `JSON_BUILD_OBJECT('id', r.id, 'name', r.name, 'code', r.code) AS role`,
      ])
      .innerJoin(Role, 'r', 'r.id = e.roleId');

    if (!isEmpty(keyword)) {
      query.andWhere(
        `(
        LOWER(UNACCENT(e.name)) ILIKE UNACCENT(:keyword) ESCAPE '\\'
        OR LOWER(UNACCENT(e.code)) ILIKE UNACCENT(:keyword) ESCAPE '\\'
        OR LOWER(UNACCENT(e.phoneNumber)) ILIKE UNACCENT(:keyword) ESCAPE '\\'
      )`,
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    if (roleId) {
      query.andWhere('e.roleId = :roleId', { roleId });
    }

    if (isDefined(status)) {
      query.andWhere('e.status = :status', { status });
    }

    if (dateJoinFrom) {
      query.andWhere('e.dateJoin::DATE >= :dateJoinFrom::DATE', {
        dateJoinFrom,
      });
    }

    if (dateJoinTo) {
      query.andWhere('e.dateJoin::DATE <= :dateJoinTo::DATE', {
        dateJoinTo,
      });
    }

    if (dateOutFrom) {
      query.andWhere('e.dateOut::DATE >= :dateOutFrom::DATE', {
        dateOutFrom,
      });
    }

    if (dateOutTo) {
      query.andWhere('e.dateOut::DATE <= :dateOutTo::DATE', {
        dateOutTo,
      });
    }

    if (isEmpty(sort)) {
      query.orderBy('createdAt', SortEnum.DESC);
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'code':
          case 'status':
          case 'price':
          case 'categoryId':
          case 'createdAt':
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
        entity.dateJoin = new Date();
        entity.dateOut = null;
        break;
      case EmployeeStatusEnum.LEAVE:
        entity.dateOut = new Date();
        break;
    }
    entity.status = request.status;
    return entity;
  }

  updateEntityByManager(
    entity: Employee,
    request: UpdateEmployeeByManagerBodyDto,
  ): Employee {
    const { code, dateJoin, dateOut } = request;
    const newEntity = this.updateEntity(entity, request);
    newEntity.code = code;
    newEntity.dateJoin = dateJoin;
    newEntity.dateOut = dateOut;

    return entity;
  }

  updateEntityByAdmin(
    entity: Employee,
    request: UpdateEmployeeByAdminBodyDto,
  ): Employee {
    const { roleId, salary } = request;
    const newEntity = this.updateEntityByManager(entity, request);
    newEntity.roleId = roleId;
    newEntity.salary = salary;

    return newEntity;
  }
}
