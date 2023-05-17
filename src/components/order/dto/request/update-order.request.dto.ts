import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import CUSTOMER_SCHEMA from '@src/components/customer/constants/schema';
import { COMMON_SCHEMA } from '@src/constants/common';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ORDER_DETAIL_SCHEMA, ORDER_SCHEMA } from '../../constants/schema';
import { BaseSocketDto } from './base-socket.dto';

class OrderDetailDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  id: number;

  @ApiProperty({ example: 1 })
  @Min(ORDER_DETAIL_SCHEMA.QUANTITY.MIN)
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 12000 })
  @Min(ORDER_DETAIL_SCHEMA.PRICE.MIN)
  @IsInt()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ example: 'ít cay' })
  @MaxLength(ORDER_DETAIL_SCHEMA.NOTE.LENGTH)
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  dishId: number;
}

export class UpdateOrderRequestDto extends BaseSocketDto {
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

  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  @ArrayNotEmpty()
  details: OrderDetailDto[];

  customerId?: number;
}
