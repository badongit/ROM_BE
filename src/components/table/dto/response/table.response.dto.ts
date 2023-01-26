import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TableResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  code: number;

  @ApiProperty()
  @Expose()
  max_people: number;

  @ApiProperty()
  @Expose()
  floor_id: number;
}
