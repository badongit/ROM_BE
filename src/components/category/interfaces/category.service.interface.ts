import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { ResponsePayload } from '@src/core/interfaces/response-payload';
import { CreateCategoryBodyDto } from '../dto/request/create-category.body.dto';
import { ListCategoryQueryDto } from '../dto/request/list-category.query.dto';
import { UpdateCategoryBodyDto } from '../dto/request/update-category.body.dto';
import { CategoryResponseDto } from '../dto/response/category.response.dto';
import { DetailCategoryResponseDto } from '../dto/response/detail-category.response.dto';

export interface ICategoryService {
  create(request: CreateCategoryBodyDto): Promise<ResponsePayload<any>>;
  list(
    request: ListCategoryQueryDto,
  ): Promise<ResponsePayload<CategoryResponseDto>>;
  detail(
    request: IdParamsDto,
  ): Promise<ResponsePayload<DetailCategoryResponseDto | any>>;
  update(
    request: IdParamsDto & UpdateCategoryBodyDto,
  ): Promise<ResponsePayload<any>>;
  delete(request: IdParamsDto): Promise<ResponsePayload<any>>;
}
