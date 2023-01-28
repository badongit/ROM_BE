import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { BaseRepository } from '@src/core/repositories/base.repository';
import { CreateDishBodyDto } from '../dto/request/creat-dish.body.dto';
import { ListDishQueryDto } from '../dto/request/list-dish.query.dto';
import { UpdateDishBodyDto } from '../dto/request/update-dish.body.dto';
import { Dish } from '../entities/dish.entity';

export interface IDishRepository extends BaseRepository<Dish> {
  createEntity(request: CreateDishBodyDto): Dish;
  updateEntity(entity: Dish, request: UpdateDishBodyDto): Dish;
  list(request: ListDishQueryDto): Promise<[Dish[], number]>;
}
