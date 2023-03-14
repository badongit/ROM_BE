import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { COMMON_SCHEMA } from '@src/constants/common';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
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
import { ORDER_DETAIL_SCHEMA, ORDER_SCHEMA } from '../constants/schema';
import { OrderStatusEnum } from '../constants/status.enum';
import { OrderTypeEnum } from '../constants/type.enum';

class OrderDetailDto {
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

export class CreateOrderDto {
  @ApiProperty({ example: 0 })
  @IsEnum(OrderTypeEnum)
  @IsNotEmpty()
  type: OrderTypeEnum;

  @ApiProperty({ example: 0 })
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;

  @ApiPropertyOptional({ example: 'dat ban 10 nguoi' })
  @IsString()
  @MaxLength(ORDER_SCHEMA.NOTE.LENGTH)
  @IsOptional()
  note: string;

  @ValidateIf((object) => object.type === OrderTypeEnum.IN_HERE)
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tableId: number;

  @ApiProperty({ example: '0123456789' })
  @IsString()
  @Matches(COMMON_SCHEMA.PHONE_NUMBER.REGEX)
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  customerPhoneNumber: string;

  @ValidateIf((object) => object.type === OrderTypeEnum.BRING_BACK)
  @ApiProperty({ example: 'H10' })
  @IsString()
  @MaxLength(ORDER_SCHEMA.WAITING_TICKET.LENGTH)
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  waitingTicket: string;

  customerId?: number;

  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @Type(() => OrderDetailDto)
  @ArrayNotEmpty()
  details: OrderDetailDto[];
}
