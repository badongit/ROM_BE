import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SummaryOrderResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  countCompleted: number;

  @ApiProperty({ example: 1 })
  @Expose()
  countCanceled: number;
}
