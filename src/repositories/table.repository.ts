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
    const { code, max_people, description, floor_id } = request;
    const entity = new Table();
    entity.code = code;
    entity.max_people = max_people;
    entity.description = description;
    entity.status = TableStatusEnum.EMPTY;
    entity.floor_id = floor_id;

    return entity;
  }

  updateEntity(entity: Table, request: UpdateTableBodyDto): Table {
    const { code, max_people, description, note, floor_id } = request;
    entity.code = code;
    entity.max_people = max_people;
    entity.description = description;
    entity.note = note;
    entity.floor_id = floor_id;

    return entity;
  }

  list(request: ListTableQueryDto): Promise<[Table[], number]> {
    const { sort, take, skip, floor_id, status } = request;
    const sortObj: any = {};
    const conditions: any = {};

    if (isEmpty(sort)) {
      sortObj.created_at = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'code':
          case 'max_people':
          case 'floor_id':
          case 'created_at':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }

    if (floor_id) {
      conditions.floor_id = floor_id;
    }

    if (isDefined(status)) {
      conditions.status = status;
    }

    return this.tableRepository.findAndCount({
      where: conditions,
      order: sortObj,
      take: take,
      skip: skip,
    });
  }
}
