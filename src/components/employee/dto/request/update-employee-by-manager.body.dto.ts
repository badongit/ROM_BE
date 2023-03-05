import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import EMPLOYEE_SCHEMA from '../../constants/schema';
import { UpdateEmployeeBodyDto } from './update-employee.body,dto';

export class UpdateEmployeeByManagerBodyDto extends UpdateEmployeeBodyDto {
  @ApiPropertyOptional({ example: 'W01' })
  @MaxLength(EMPLOYEE_SCHEMA.CODE.LENGTH)
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  @IsOptional()
  code: string;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  dateJoin: Date;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  dateOut: Date;
}
