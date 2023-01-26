import { UpdateFloorBodyDto } from './../dto/request/update-floor.body.dto';
import { ListFloorQueryDto } from './../dto/request/list-floor.query.dto';
import { BaseRepository } from 'src/core/repositories/base.repository';
import { CreateFloorBodyDto } from '../dto/request/create-floor.body.dto';
import { Floor } from '../entities/floor.entity';

export interface IFloorRepository extends BaseRepository<Floor> {
  createEntity(request: CreateFloorBodyDto): Floor;
  updateEntity(entity: Floor, request: UpdateFloorBodyDto): Floor;
  list(request: ListFloorQueryDto): Promise<[Floor[], number]>;
}
