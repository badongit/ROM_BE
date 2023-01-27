import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class DetailResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: '2023-01-21T07:48:18.262Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: '2023-01-21T07:48:18.262Z' })
  @Expose()
  updated_at: Date;
}
