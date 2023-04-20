import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { PaymentMethodEnum } from '../../constants/enums';
import { ORDER_SCHEMA } from '../../constants/schema';
import { UpdateOrderRequestDto } from './update-order.request.dto';

export class CompleteOrderRequestDto extends UpdateOrderRequestDto {
  @ApiProperty({ example: 1 })
  @IsEnum(PaymentMethodEnum)
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Min(ORDER_SCHEMA.POINT_USED.MIN)
  @IsOptional()
  pointUsed: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  cashierId: number;
}
