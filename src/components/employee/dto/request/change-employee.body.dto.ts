import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EmployeeStatusEnum } from '../../constants/status.enum';

export class ChangeStatusEmployeeBodyDto {
  @ApiProperty({ example: 1 })
  @IsEnum(EmployeeStatusEnum)
  @IsNotEmpty()
  status: EmployeeStatusEnum;
}
