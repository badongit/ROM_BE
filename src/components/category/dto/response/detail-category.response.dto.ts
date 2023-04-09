import { ApiProperty } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/core/dto/response/detail.response.dto';
import { Expose } from 'class-transformer';

export class DetailCategoryResponseDto extends DetailResponseDto {
  @ApiProperty({ example: 'Nướng' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'asjhkfasf' })
  @Expose()
  image: string;

  @ApiProperty({ example: true })
  @Expose()
  active: boolean;

  @ApiProperty({ example: 'Món nướng' })
  @Expose()
  description: string;
}
