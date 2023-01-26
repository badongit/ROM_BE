import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListFloorQueryDto } from '@src/components/floor/dto/request/list-floor.query.dto';
import { isEmpty } from 'lodash';
import { CreateFloorBodyDto } from 'src/components/floor/dto/request/create-floor.body.dto';
import { Floor } from 'src/components/floor/entities/floor.entity';
import { IFloorRepository } from 'src/components/floor/interfaces/floor.repository.interface';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { Repository } from 'typeorm';
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
    entity.code = request.code;
    entity.created_at = new Date();
    return entity;
  }

  updateEntity(entity: Floor, request: UpdateFloorBodyDto): Floor {
    entity.name = request.name;
    entity.code = request.code;
    return entity;
  }

  list(request: ListFloorQueryDto): Promise<[Floor[], number]> {
    const { sort, take, skip } = request;
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

    return this.floorRepository.findAndCount({
      order: sortObj,
      take: take,
      skip: skip,
    });
  }
}
