import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TimeTypeEnum } from '../../constants/enums';

export class DashboardTimeRequestDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiPropertyOptional()
  @IsEnum(TimeTypeEnum)
  @Transform(({ value }) => +value ?? TimeTypeEnum.DAY)
  @IsOptional()
  timeType: TimeTypeEnum;
}
