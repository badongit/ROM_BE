import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from '@src/components/category/dto/response/category.response.dto';
import { Expose, Type } from 'class-transformer';

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
  categoryId: number;

  @ApiProperty({ type: CategoryResponseDto })
  @Type(() => CategoryResponseDto)
  @Expose()
  category: CategoryResponseDto;
}
