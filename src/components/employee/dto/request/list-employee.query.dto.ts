import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/core/dto/request/pagination.query.dto';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { EmployeeStatusEnum } from '../../constants/status.enum';

export class ListEmployeeQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  role_id: number;

  @ApiPropertyOptional({ example: 0 })
  @IsEnum(EmployeeStatusEnum)
  @Transform(({ value }) => +value)
  @IsOptional()
  status: number;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  date_join_from: Date;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  date_join_to: Date;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  date_out_from: Date;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  date_out_to: Date;
}
