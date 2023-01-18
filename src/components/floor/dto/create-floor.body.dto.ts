import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import FLOOR_SCHEMA from '../constants/schema';

export class CreateFloorBodyDto {
  @IsString()
  @MaxLength(FLOOR_SCHEMA.NAME.LENGTH)
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  @MaxLength(FLOOR_SCHEMA.CODE.LENGTH)
  @IsNotEmpty()
  code: string;
}
