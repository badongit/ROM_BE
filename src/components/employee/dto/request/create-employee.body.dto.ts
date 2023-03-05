import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import EMPLOYEE_SCHEMA from '../../constants/schema';

export class CreateEmployeeBodyDto {
  @ApiProperty({ example: 'Nguyễn Thị Lan Anh' })
  @MaxLength(EMPLOYEE_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'W01' })
  @MaxLength(EMPLOYEE_SCHEMA.CODE.LENGTH)
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: '0123456789' })
  @Matches(EMPLOYEE_SCHEMA.PHONE_NUMBER.REGEX)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '12345678' })
  @MaxLength(EMPLOYEE_SCHEMA.PASSWORD.MAX_LENGTH)
  @MinLength(EMPLOYEE_SCHEMA.PASSWORD.MIN_LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ example: '2023-01-21T07:48:18.262Z' })
  @IsDateString()
  @IsOptional()
  dateJoin: Date;

  @ApiPropertyOptional({ example: 3000000 })
  @Min(EMPLOYEE_SCHEMA.SALARY.MIN)
  @IsInt()
  @IsOptional()
  salary: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  roleId: number;
}
