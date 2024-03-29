import { ApiPropertyOptional } from '@nestjs/swagger';
import { COMMON_SCHEMA } from '@src/constants/common';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import CUSTOMER_SCHEMA from '../../constants/schema';

export class UpdateCustomerBodyDto {
  @ApiPropertyOptional({ example: 'Nguyễn Thị Huệ' })
  @MaxLength(CUSTOMER_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @Matches(COMMON_SCHEMA.PHONE_NUMBER.REGEX)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  phoneNumber: string;
}
