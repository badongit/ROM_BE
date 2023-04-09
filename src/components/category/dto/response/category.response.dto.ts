import { ApiProperty } from '@nestjs/swagger';
import { DetailDishResponseDto } from '@src/components/dish/dto/response/detail-dish.response.dto';
import { Expose, Type } from 'class-transformer';

export class CategoryResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Nướng' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'jdkashdasklf' })
  @Expose()
  image: string;

  @ApiProperty({ example: true })
  @Expose()
  active: boolean;

  @ApiProperty({ type: DetailDishResponseDto, isArray: true })
  @Type(() => DetailDishResponseDto)
  @Expose()
  dishes: DetailDishResponseDto[];
}
