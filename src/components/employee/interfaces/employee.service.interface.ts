import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { ChangeStatusEmployeeBodyDto } from '../dto/request/change-employee.body.dto';
import { CreateEmployeeBodyDto } from '../dto/request/create-employee.body.dto';
import { ListEmployeeQueryDto } from '../dto/request/list-employee.query.dto';
import { UpdateEmployeeByAdminBodyDto } from '../dto/request/update-employee-by-admin.body.dto';
import { UpdateEmployeeByManagerBodyDto } from '../dto/request/update-employee-by-manager.body.dto';
import { UpdateEmployeeBodyDto } from '../dto/request/update-employee.body,dto';
import { DetailEmployeeResponseDto } from '../dto/response/detail-employee.response.dto';
import { EmployeeResponseDto } from '../dto/response/employee.response.dto';

export interface IEmployeeService {
  create(request: CreateEmployeeBodyDto): Promise<ResponsePayload<any>>;
  update(
    request: IdParamsDto & UpdateEmployeeBodyDto,
  ): Promise<ResponsePayload<any>>;
  list(
    request: ListEmployeeQueryDto,
  ): Promise<ResponsePayload<EmployeeResponseDto>>;
  detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailEmployeeResponseDto | any>>;
  delete(request: IdParamsDto): Promise<ResponsePayload<any>>;
  changeStatus(
    request: IdParamsDto & ChangeStatusEmployeeBodyDto,
  ): Promise<ResponsePayload<any>>;
  updateByManager(
    request: IdParamsDto & UpdateEmployeeByManagerBodyDto,
  ): Promise<ResponsePayload<any>>;
  updateByAdmin(
    request: IdParamsDto & UpdateEmployeeByAdminBodyDto,
  ): Promise<ResponsePayload<any>>;
}
