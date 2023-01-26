import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/core/dto/response/detail.response.dto';

export class DetailFloorResponseDto extends DetailResponseDto {
  @ApiProperty({ example: 'Tầng 1' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'T01' })
  @Expose()
  code: string;
}
