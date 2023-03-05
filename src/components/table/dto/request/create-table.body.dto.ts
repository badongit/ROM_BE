import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import TABLE_SCHEMA from '../../constants/schema';

export class CreateTableBodyDto {
  @ApiProperty({ description: "table's code", example: 'T01-B1' })
  @MaxLength(TABLE_SCHEMA.CODE.LENGTH)
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'number max people', example: 10 })
  @Min(TABLE_SCHEMA.MAX_PEOPLE.MIN)
  @IsInt()
  @IsNotEmpty()
  maxPeople: number;

  @ApiPropertyOptional({ description: 'description', example: '' })
  @MaxLength(TABLE_SCHEMA.DESCRIPTION.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'floor id', example: 1 })
  @IsInt()
  @IsNotEmpty()
  floorId: number;
}
