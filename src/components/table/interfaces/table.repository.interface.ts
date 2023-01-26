import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateTableBodyDto } from '../dto/request/create-table.body.dto';
import { ListTableQueryDto } from '../dto/request/list-table.query.dto';
import { UpdateTableBodyDto } from '../dto/request/update-table.body.dto';
import { Table } from '../entities/table.entity';

export interface ITableRepository extends BaseRepository<Table> {
  createEntity(request: CreateTableBodyDto): Table;
  updateEntity(entity: Table, request: UpdateTableBodyDto): Table;
  list(request: ListTableQueryDto): Promise<[Table[], number]>;
}
