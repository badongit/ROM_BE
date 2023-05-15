import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class FloorResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Tầng 1' })
  @Expose()
  name: string;
}

export class TableResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'T01-B1' })
  @Expose()
  code: string;

  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: 5 })
  @Expose()
  maxPeople: number;

  @ApiProperty({ example: 1 })
  @Expose()
  floorId: number;

  @ApiProperty({ type: FloorResponseDto })
  @Type(() => FloorResponseDto)
  @Expose()
  floor: FloorResponseDto;
}
