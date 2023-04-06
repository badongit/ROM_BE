import { ApiProperty } from '@nestjs/swagger';
import { TableResponseDto } from '@src/components/table/dto/response/table.response.dto';
import { Expose, Type } from 'class-transformer';

export class FloorResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Tầng 1' })
  @Expose()
  name: string;

  @ApiProperty({ type: TableResponseDto })
  @Type(() => TableResponseDto)
  @Expose()
  tables: TableResponseDto[];
}
