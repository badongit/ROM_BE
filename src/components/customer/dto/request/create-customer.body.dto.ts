import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { COMMON_SCHEMA } from '@src/constants/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import CUSTOMER_SCHEMA from '../../constants/schema';

export class CreateCustomerBodyDto {
  @ApiPropertyOptional({ example: 'Nguyễn Thị Huệ' })
  @MaxLength(CUSTOMER_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: '0123456789' })
  @Matches(COMMON_SCHEMA.PHONE_NUMBER.REGEX)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
