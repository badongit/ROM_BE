import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DishResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Nướng hải sản' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'image' })
  @Expose()
  image: string;

  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: 156000 })
  @Expose()
  price: number;

  @ApiProperty({ example: 1 })
  @Expose()
  category_id: number;
}
