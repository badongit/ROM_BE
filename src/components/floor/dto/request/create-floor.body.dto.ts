import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import FLOOR_SCHEMA from '../../constants/schema';

export class CreateFloorBodyDto {
  @ApiProperty({ description: "floor's name", example: 'Tầng 1' })
  @MaxLength(FLOOR_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;
}
