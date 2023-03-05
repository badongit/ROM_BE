import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import EMPLOYEE_SCHEMA from '../../constants/schema';

export class UpdateEmployeeBodyDto {
  @ApiPropertyOptional({ example: 'Nguyễn Thị Lan Anh' })
  @MaxLength(EMPLOYEE_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @Matches(EMPLOYEE_SCHEMA.PHONE_NUMBER.REGEX)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiPropertyOptional({ example: '12345678' })
  @MaxLength(EMPLOYEE_SCHEMA.PASSWORD.MAX_LENGTH)
  @MinLength(EMPLOYEE_SCHEMA.PASSWORD.MIN_LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  password: string;
}
