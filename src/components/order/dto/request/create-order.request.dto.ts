import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import CUSTOMER_SCHEMA from '@src/components/customer/constants/schema';
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
  ValidateNested,
} from 'class-validator';
import { OrderStatusEnum, OrderTypeEnum } from '../../constants/enums';
import { ORDER_DETAIL_SCHEMA, ORDER_SCHEMA } from '../../constants/schema';

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

export class CreateOrderRequestDto {
  @ApiProperty({ example: 0 })
  @IsEnum(OrderTypeEnum)
  @IsNotEmpty()
  type: OrderTypeEnum;

  @ApiProperty({ example: 0 })
  @IsEnum(OrderStatusEnum)
  @IsNotEmpty()
  status: OrderStatusEnum;

  @ApiPropertyOptional({ example: 'dat ban 10 nguoi' })
  @MaxLength(ORDER_SCHEMA.NOTE.LENGTH)
  @IsString()
  @IsOptional()
  note: string;

  @ValidateIf((object) => object.type === OrderTypeEnum.IN_HERE)
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  tableId: number;

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

  @ValidateIf((object) => object.type === OrderTypeEnum.BRING_BACK)
  @ApiProperty({ example: 'H10' })
  @MaxLength(ORDER_SCHEMA.WAITING_TICKET.LENGTH)
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsNotEmpty()
  waitingTicket: string;

  customerId?: number;

  @ApiProperty({ type: OrderDetailDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  @ArrayNotEmpty()
  details: OrderDetailDto[];
}
