import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TableStatusEnum } from '../../constants/status.enum';

export class ListTableQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'floor id', example: 1 })
  @Transform((value) => +value)
  @IsInt()
  @IsOptional()
  floor_id: number;

  @ApiPropertyOptional({
    description: "table's status",
    example: 1,
  })
  @IsEnum(TableStatusEnum)
  @Transform(({ value }) => +value)
  @IsOptional()
  status: number;
}
