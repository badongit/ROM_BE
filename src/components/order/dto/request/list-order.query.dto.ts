import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { OrderStatusEnum } from '../../constants/enums';

export class ListOrderQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: "order's status",
    example: 1,
  })
  @IsEnum(OrderStatusEnum, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string')
      return value.split(',').map((value) => +value);

    return value ?? [];
  })
  @IsOptional()
  status: number[];

  @ApiPropertyOptional({ example: '1' })
  @Transform(({ value }) => +value)
  @IsOptional()
  isGetDetails: number;
}
