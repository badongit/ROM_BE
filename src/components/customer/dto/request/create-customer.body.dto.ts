import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @Matches(CUSTOMER_SCHEMA.PHONE_NUMBER.REGEX)
  @MaxLength(CUSTOMER_SCHEMA.PHONE_NUMBER.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  phone_number: string;
}
