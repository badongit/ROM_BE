import { ApiProperty } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/core/dto/response/detail.response.dto';
import { Expose } from 'class-transformer';

export class DetailTableResponseDto extends DetailResponseDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  status: number;

  @ApiProperty()
  @Expose()
  max_people: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  note: string;

  @ApiProperty()
  @Expose()
  floor_id: number;
}
