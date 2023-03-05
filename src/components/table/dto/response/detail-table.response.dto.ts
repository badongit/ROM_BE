import { ApiProperty } from '@nestjs/swagger';
import { DetailResponseDto } from '@src/core/dto/response/detail.response.dto';
import { Expose } from 'class-transformer';

export class DetailTableResponseDto extends DetailResponseDto {
  @ApiProperty({ example: 'T01-B1' })
  @Expose()
  code: string;

  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: 5 })
  @Expose()
  maxPeople: number;

  @ApiProperty({ example: '' })
  @Expose()
  description: string;

  @ApiProperty({ example: '' })
  @Expose()
  note: string;

  @ApiProperty({ example: 1 })
  @Expose()
  floorId: number;
}
