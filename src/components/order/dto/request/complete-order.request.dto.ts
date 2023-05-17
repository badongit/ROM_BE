import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import CUSTOMER_SCHEMA from '@src/components/customer/constants/schema';
import { COMMON_SCHEMA } from '@src/constants/common';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { PaymentMethodEnum } from '../../constants/enums';
import { ORDER_SCHEMA } from '../../constants/schema';
import { BaseSocketDto } from './base-socket.dto';

export class CompleteOrderRequestDto extends BaseSocketDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional({ example: 'dat ban 10 nguoi' })
  @MaxLength(ORDER_SCHEMA.NOTE.LENGTH)
  @IsString()
  @IsOptional()
  note: string;

  @ValidateIf((obj) => obj.customerPhoneNumber?.trim() !== '')
  @ApiProperty({ example: '0123456789' })
  @Matches(COMMON_SCHEMA.PHONE_NUMBER.REGEX)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  customerPhoneNumber: string;

  @ApiProperty({ example: 'Nguyễn Bá Đông' })
  @MaxLength(CUSTOMER_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  customerName: string;

  @ApiProperty({ example: 1 })
  @IsEnum(PaymentMethodEnum)
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(ORDER_SCHEMA.POINT_USED.MIN)
  @Transform(({ value }) => +value)
  @IsOptional()
  pointUsed: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  cashierId: number;
}
