import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CustomerResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

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
