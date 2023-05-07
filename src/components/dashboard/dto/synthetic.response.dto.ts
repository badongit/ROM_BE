import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SyntheticResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  totalTable: number;

  @ApiProperty({ example: 1 })
  @Expose()
  totalCustomer: number;

  @ApiProperty({ example: 1 })
  @Expose()
  totalEmployee: number;

  @ApiProperty({ example: 1 })
  @Expose()
  totalDish: number;
}
