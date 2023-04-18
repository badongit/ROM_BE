import { IdParamsDto } from '@src/core/dto/request/id.params.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderDetailStatusEnum } from '../../constants/enums';
import { Transform } from 'class-transformer';

export class ChangeStatusOrderDetailRequestDto extends IdParamsDto {
  @IsEnum(OrderDetailStatusEnum)
  @Transform(({ value }) => +value)
  @IsNotEmpty()
  status: OrderDetailStatusEnum;
}
