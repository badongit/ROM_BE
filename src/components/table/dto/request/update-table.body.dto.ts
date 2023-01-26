import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import TABLE_SCHEMA from '../../constants/schema';

export class UpdateTableBodyDto {
  @ApiPropertyOptional({ description: "table's code", example: 'T01-B1' })
  @MaxLength(TABLE_SCHEMA.CODE.LENGTH)
  @IsString()
  @IsOptional()
  code: string;

  @ApiPropertyOptional({ description: 'number max people', example: 10 })
  @Min(TABLE_SCHEMA.MAX_PEOPLE.MIN)
  @IsInt()
  @IsOptional()
  max_people: number;

  @ApiPropertyOptional({ description: 'description', example: '' })
  @MaxLength(TABLE_SCHEMA.DESCRIPTION.LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'note', example: '' })
  @MaxLength(TABLE_SCHEMA.NOTE.LENGTH)
  @IsString()
  @IsOptional()
  note: string;

  @ApiPropertyOptional({ description: 'floor id', example: 1 })
  @IsInt()
  @IsOptional()
  floor_id: number;
}
