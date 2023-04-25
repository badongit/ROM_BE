import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import TABLE_SCHEMA from '../../constants/schema';

export class UpdateTableBodyDto {
  @ApiPropertyOptional({ description: "table's code", example: 'T01-B1' })
  @MaxLength(TABLE_SCHEMA.CODE.LENGTH)
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString()
  @IsOptional()
  code: string;

  @ApiPropertyOptional({ description: 'number max people', example: 10 })
  @Min(TABLE_SCHEMA.MAX_PEOPLE.MIN)
  @Transform(({ value }) => +value)
  @IsInt()
  @IsOptional()
  maxPeople: number;

  @ApiPropertyOptional({ description: 'description', example: '' })
  @MaxLength(TABLE_SCHEMA.DESCRIPTION.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'note', example: '' })
  @MaxLength(TABLE_SCHEMA.NOTE.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ description: 'floor id', example: 1 })
  @IsInt()
  @IsOptional()
  floorId: number;
}
