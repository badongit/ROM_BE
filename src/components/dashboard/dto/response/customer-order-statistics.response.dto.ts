import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from '@src/components/customer/dto/response/customer.response.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class CustomerOrderStatisticsResponseDto {
  @ApiProperty()
  @Transform(({ value }) => +value)
  @Expose()
  total: number;

  @ApiProperty()
  @Type(() => CustomerResponseDto)
  @Expose()
  customer: CustomerResponseDto;
}
