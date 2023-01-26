import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FloorResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Tầng 1' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'T01' })
  @Expose()
  code: string;
}
