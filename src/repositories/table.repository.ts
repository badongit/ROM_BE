import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableStatusEnum } from '@src/components/table/constants/status.enum';
import { CreateTableBodyDto } from '@src/components/table/dto/request/create-table.body.dto';
import { ListTableQueryDto } from '@src/components/table/dto/request/list-table.query.dto';
import { UpdateTableBodyDto } from '@src/components/table/dto/request/update-table.body.dto';
import { Table } from '@src/components/table/entities/table.entity';
import { ITableRepository } from '@src/components/table/interfaces/table.repository.interface';
import { SortEnum } from '@src/constants/enum/sort.enum';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { isDefined } from 'class-validator';
import { isEmpty } from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class TableRepository
  extends BaseRepository<Table>
  implements ITableRepository
{
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {
    super(tableRepository);
  }
  createEntity(request: CreateTableBodyDto): Table {
    const { code, maxPeople, description, floorId } = request;
    const entity = new Table();
    entity.code = code;
    entity.maxPeople = maxPeople;
    entity.description = description;
    entity.status = TableStatusEnum.EMPTY;
    entity.floorId = floorId;

    return entity;
  }

  updateEntity(entity: Table, request: UpdateTableBodyDto): Table {
    const { code, maxPeople, description, note, floorId } = request;
    entity.code = code;
    entity.maxPeople = maxPeople;
    entity.description = description;
    entity.note = note;
    entity.floorId = floorId;

    return entity;
  }

  list(request: ListTableQueryDto): Promise<[Table[], number]> {
    const { sort, take, skip, floorId, status, isGetAll } = request;
    const sortObj: any = {};
    const conditions: any = {};

    if (isEmpty(sort)) {
      sortObj.createdAt = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
          case 'maxPeople':
          case 'floorId':
          case 'createdAt':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }

    if (floorId) {
      conditions.floorId = floorId;
    }

    if (isDefined(status)) {
      conditions.status = status;
    }

    return this.findAndCount({
      where: conditions,
      order: sortObj,
      take: take,
      skip: skip,
      isGetAll: isGetAll,
    });
  }
}
