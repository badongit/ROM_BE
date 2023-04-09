import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ListCategoryQueryDto extends PaginationQueryDto {
  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  isGetDishes: number;
}
