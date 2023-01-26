import { UpdateFloorBodyDto } from './../dto/request/update-floor.body.dto';
import { FloorResponseDto } from './../dto/response/floor.response.dto';
import { ListFloorQueryDto } from './../dto/request/list-floor.query.dto';
import { ResponsePayload } from '../../../core/interfaces/response-payload';
import { CreateFloorBodyDto } from 'src/components/floor/dto/request/create-floor.body.dto';
import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { DetailFloorResponseDto } from '../dto/response/detail-floor.response.dto';

export interface IFloorService {
  create(request: CreateFloorBodyDto): Promise<ResponsePayload<any>>;
  list(request: ListFloorQueryDto): Promise<ResponsePayload<FloorResponseDto>>;
  detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailFloorResponseDto>>;
  update(
    request: IdParamsDto & UpdateFloorBodyDto,
  ): Promise<ResponsePayload<any>>;
  delete(request: IdParamsDto): Promise<ResponsePayload<any>>;
}
