import { ApiProperty } from '@nestjs/swagger';
import { DishResponseDto } from '@src/components/dish/dto/response/dish.response.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class DishOrderStatisticsResponseDto {
  @ApiProperty()
  @Transform(({ value }) => +value)
  @Expose()
  sold: number;

  @ApiProperty()
  @Type(() => DishResponseDto)
  @Expose()
  dish: DishResponseDto;
}
