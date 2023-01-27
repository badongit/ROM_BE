import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Nướng' })
  @Expose()
  name: string;

  @ApiProperty({ example: true })
  @Expose()
  active: boolean;
}
