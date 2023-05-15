import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class OrderStatisticsResponseDto {
  @ApiProperty()
  @Transform(({ value }) => +value)
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  time: string;
}
