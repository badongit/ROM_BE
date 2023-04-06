import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListFloorQueryDto } from '@src/components/floor/dto/request/list-floor.query.dto';
import { isEmpty } from 'lodash';
import { CreateFloorBodyDto } from 'src/components/floor/dto/request/create-floor.body.dto';
import { Floor } from 'src/components/floor/entities/floor.entity';
import { IFloorRepository } from 'src/components/floor/interfaces/floor.repository.interface';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { FindManyOptions, Repository } from 'typeorm';
import { UpdateFloorBodyDto } from './../components/floor/dto/request/update-floor.body.dto';
import { SortEnum } from './../constants/enum/sort.enum';

@Injectable()
export class FloorRepository
  extends BaseRepository<Floor>
  implements IFloorRepository
{
  constructor(
    @InjectRepository(Floor)
    private readonly floorRepository: Repository<Floor>,
  ) {
    super(floorRepository);
  }
  createEntity(request: CreateFloorBodyDto): Floor {
    const entity = new Floor();
    entity.name = request.name;
    entity.createdAt = new Date();
    return entity;
  }

  updateEntity(entity: Floor, request: UpdateFloorBodyDto): Floor {
    entity.name = request.name;
    return entity;
  }

  list(request: ListFloorQueryDto): Promise<[Floor[], number]> {
    const { sort, take, skip, isGetAll, isGetTables } = request;
    const sortObj: any = {};

    if (isEmpty(sort)) {
      sortObj.createdAt = SortEnum.DESC;
    } else {
      sort.forEach((item) => {
        switch (item.column) {
          case 'name':
          case 'createdAt':
            sortObj[item.column] = item.order;
            break;
        }
      });
    }
    const findOptions: FindManyOptions<Floor> & { isGetAll: number } = {
      order: sortObj,
      take: take,
      skip: skip,
      isGetAll,
    };

    if (isGetTables) {
      findOptions.relations = { tables: true };
    }

    return this.findAndCount(findOptions);
  }
}
