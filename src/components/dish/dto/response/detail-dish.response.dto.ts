import { ApiProperty } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/core/dto/response/detail.response.dto';
import { Expose } from 'class-transformer';

export class DetailDishResponseDto extends DetailResponseDto {
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

  @ApiProperty({ example: '' })
  @Expose()
  description: string;

  @ApiProperty({ example: 1 })
  @Expose()
  categoryId: number;
}
