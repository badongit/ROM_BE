import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '../../constants/enums';

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'HD0230331195400' })
  @Expose()
  code: string;

  @ApiProperty({ example: 100000 })
  @Expose()
  paymentReality: number;

  @ApiProperty({ example: 0 })
  @Expose()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ example: 0 })
  @Expose()
  status: OrderStatusEnum;

  @ApiProperty({ example: 0 })
  @Expose()
  type: OrderTypeEnum;

  @ApiProperty({ example: 1 })
  @Expose()
  tableId: number;

  @ApiProperty({ example: 'H10' })
  @Expose()
  waitingTicket: string;
}
