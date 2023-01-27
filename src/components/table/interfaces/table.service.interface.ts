import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { TableStatusEnum } from '../constants/status.enum';
import { ChangeStatusTableBodyDto } from '../dto/request/change-status-table.body.dto';
import { CreateTableBodyDto } from '../dto/request/create-table.body.dto';
import { ListTableQueryDto } from '../dto/request/list-table.query.dto';
import { UpdateTableBodyDto } from '../dto/request/update-table.body.dto';
import { DetailTableResponseDto } from '../dto/response/detail-table.response.dto';
import { TableResponseDto } from '../dto/response/table.response.dto';

export interface ITableService {
  create(request: CreateTableBodyDto): Promise<ResponsePayload<any>>;
  list(request: ListTableQueryDto): Promise<ResponsePayload<TableResponseDto>>;
  detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailTableResponseDto | any>>;
  update(
    request: IdParamsDto & UpdateTableBodyDto,
  ): Promise<ResponsePayload<any>>;
  changeStatus(
    request: IdParamsDto & ChangeStatusTableBodyDto,
  ): Promise<ResponsePayload<any>>;
  delete(request: IdParamsDto): Promise<ResponsePayload<any>>;
  validateChangeStatus(
    oldStatus: TableStatusEnum,
    newStatus: TableStatusEnum,
  ): ResponsePayload<any> | null;
}
