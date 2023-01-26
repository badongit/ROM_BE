import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class IdParamsDto {
  @ApiProperty({ example: '1' })
  @Transform(({ value }) => +value)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
