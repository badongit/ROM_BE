import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TableResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'T01-B1' })
  @Expose()
  code: number;

  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: 5 })
  @Expose()
  maxPeople: number;

  @ApiProperty({ example: 1 })
  @Expose()
  floorId: number;
}
