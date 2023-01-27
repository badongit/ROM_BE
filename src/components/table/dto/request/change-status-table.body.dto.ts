import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TableStatusEnum } from '../../constants/status.enum';

export class ChangeStatusTableBodyDto {
  @ApiProperty({
    description: "table's status",
    example: 1,
  })
  @IsEnum(TableStatusEnum)
  @IsNotEmpty()
  status: TableStatusEnum;
}
