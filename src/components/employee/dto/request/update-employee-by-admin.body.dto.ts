import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import EMPLOYEE_SCHEMA from '../../constants/schema';
import { UpdateEmployeeByManagerBodyDto } from './update-employee-by-manager.body.dto';

export class UpdateEmployeeByAdminBodyDto extends UpdateEmployeeByManagerBodyDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  role_id: number;

  @ApiPropertyOptional({ example: 3000000 })
  @Min(EMPLOYEE_SCHEMA.SALARY.MIN)
  @IsInt()
  @IsOptional()
  salary: number;
}
