import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { DishStatusEnum } from '../../constants/status.enum';

export class ListDishQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: "dish's status", example: 1 })
  @IsEnum(DishStatusEnum)
  @IsOptional()
  status: DishStatusEnum;

  @ApiPropertyOptional({ description: 'category id', example: 1 })
  @IsNumber()
  @IsOptional()
  categoryId: number;
}
