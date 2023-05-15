import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class RevenueStatisticsResponseDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @Expose({ name: 'totalamount' })
  totalAmount: number;

  @ApiProperty()
  @Expose()
  time: string;
}
