import { Transform } from 'class-transformer';
import { MaxLength, IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import FLOOR_SCHEMA from '../../constants/schema';

export class UpdateFloorBodyDto {
  @ApiPropertyOptional({ description: "floor's name", example: 'Tầng 1' })
  @MaxLength(FLOOR_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;
}
