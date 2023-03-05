import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StoreResponseDto {
  @ApiProperty({ example: 'Hadilao' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'images' })
  @Expose()
  image: string;

  @ApiProperty({ example: '0123456789' })
  @Expose()
  phoneNumber: string;

  @ApiProperty({
    example: '2 Hải Triều, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh ',
  })
  @Expose()
  address: string;

  @ApiProperty({ example: '' })
  @Expose()
  description: string;
}
