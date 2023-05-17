import { ApiProperty } from '@nestjs/swagger';
import { BaseSocketDto } from '@src/components/order/dto/request/base-socket.dto';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class IdParamsDto extends BaseSocketDto {
  @ApiProperty({ example: '1' })
  @Transform(({ value }) => +value)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
