import { ApiProperty } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/core/dto/response/detail.response.dto';
import { Expose } from 'class-transformer';

export class DetailCustomerResponseDto extends DetailResponseDto {
  @ApiProperty({ example: 'Nguyễn Thị Huệ' })
  @Expose()
  name: string;

  @ApiProperty({ example: '0123456789' })
  @Expose()
  phoneNumber: string;

  @ApiProperty({ example: 0 })
  @Expose()
  point: number;
}
