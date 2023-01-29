import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { IsInt, IsOptional } from 'class-validator';

export class ListEmployeeQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  role_id: number;
}
