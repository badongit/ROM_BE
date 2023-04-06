import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from 'src/core/dto/request/pagination.query.dto';

export class ListFloorQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @Transform(({ value }) => +value)
  @Optional()
  isGetTables: number;
}
