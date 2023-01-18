import { BaseRepository } from 'src/core/repositories/base.repository';
import { CreateFloorBodyDto } from '../dto/create-floor.body.dto';
import { Floor } from '../entities/floor.entity';

export interface IFloorRepository extends BaseRepository<Floor> {
  create(request: CreateFloorBodyDto): Floor;
}
