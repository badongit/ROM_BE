import { ApiProperty } from '@nestjs/swagger';
import { DetailDishResponseDto } from '@src/components/dish/dto/response/detail-dish.response.dto';
import { Expose, Type } from 'class-transformer';
import { OrderDetailStatusEnum } from '../../constants/enums';

export class OrderDetailResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  dishId: number;

  @ApiProperty({ type: DetailDishResponseDto })
  @Type(() => DetailDishResponseDto)
  @Expose()
  dish: DetailDishResponseDto;

  @ApiProperty({ example: 1 })
  @Expose()
  quantity: number;

  @ApiProperty({ example: 100000 })
  @Expose()
  price: number;

  @ApiProperty({ example: 0 })
  @Expose()
  status: OrderDetailStatusEnum;

  @ApiProperty({ example: 'khong cay' })
  @Expose()
  note: string;

  @ApiProperty({ example: 1 })
  @Expose()
  orderId: number;
}
