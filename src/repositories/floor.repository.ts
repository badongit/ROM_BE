import { Injectable } from '@nestjs/common';
import { CreateFloorBodyDto } from 'src/components/floor/dto/create-floor.body.dto';
import { Floor } from 'src/components/floor/entities/floor.entity';
import { IFloorRepository } from 'src/components/floor/interfaces/floor.repository.interface';
import { BaseRepository } from 'src/core/repositories/base.repository';

@Injectable()
export class FloorRepository
  extends BaseRepository<Floor>
  implements IFloorRepository
{
  create(request: CreateFloorBodyDto): Floor {
    const entity = new Floor();
    entity.name = request.name;
    entity.code = request.code;
    entity.createdAt = new Date();
    return entity;
  }
}
