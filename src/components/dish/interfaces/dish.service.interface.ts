import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { CreateDishBodyDto } from '../dto/request/creat-dish.body.dto';
import { ListDishQueryDto } from '../dto/request/list-dish.query.dto';
import { UpdateDishBodyDto } from '../dto/request/update-dish.body.dto';
import { DetailDishResponseDto } from '../dto/response/detail-dish.response.dto';
import { DishResponseDto } from '../dto/response/dish.response.dto';

export interface IDishService {
  create(request: CreateDishBodyDto): Promise<ResponsePayload<any>>;
  update(
    request: IdParamsDto & UpdateDishBodyDto,
  ): Promise<ResponsePayload<any>>;
  list(request: ListDishQueryDto): Promise<ResponsePayload<DishResponseDto>>;
  detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailDishResponseDto | any>>;
  delete(request: IdParamsDto): Promise<ResponsePayload<any>>;
}
