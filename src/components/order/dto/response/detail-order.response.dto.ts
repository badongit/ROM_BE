import { ApiProperty } from '@nestjs/swagger';
import { DetailCustomerResponseDto } from '@src/components/customer/dto/response/detail-customer.response.dto';
import { DetailEmployeeResponseDto } from '@src/components/employee/dto/response/detail-employee.response.dto';
import { DetailTableResponseDto } from '@src/components/table/dto/response/detail-table.response.dto';
import { Expose, Type } from 'class-transformer';
import {
  OrderStatusEnum,
  OrderTypeEnum,
  PaymentMethodEnum,
} from '../../constants/enums';
import { OrderDetailResponseDto } from './order-detail.response.dto';

export class DetailOrderResponseDto {
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

  @ApiProperty({ example: 10 })
  @Expose()
  pointUsed: number;

  @ApiProperty({ example: 0 })
  @Expose()
  status: OrderStatusEnum;

  @ApiProperty({ example: 0 })
  @Expose()
  type: OrderTypeEnum;

  @ApiProperty({ example: '' })
  @Expose()
  note: string;

  @ApiProperty({ example: 1 })
  @Expose()
  tableId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  customerId: number;

  @ApiProperty({ example: 1 })
  @Expose()
  cashierId: number;

  @ApiProperty({ example: 'H10' })
  @Expose()
  waitingTicket: string;

  @ApiProperty({ type: DetailTableResponseDto })
  @Type(() => DetailTableResponseDto)
  @Expose()
  table: DetailTableResponseDto;

  @ApiProperty({ type: DetailCustomerResponseDto })
  @Type(() => DetailCustomerResponseDto)
  @Expose()
  customer: DetailCustomerResponseDto;

  @ApiProperty({ type: DetailEmployeeResponseDto })
  @Type(() => DetailEmployeeResponseDto)
  @Expose()
  cashier: DetailEmployeeResponseDto;

  @ApiProperty({ type: OrderDetailResponseDto })
  @Type(() => OrderDetailResponseDto)
  @Expose()
  details: OrderDetailResponseDto[];
}
