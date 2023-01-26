import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'number max people', example: 10 })
  @Min(TABLE_SCHEMA.MAX_PEOPLE.MIN)
  @IsInt()
  @IsNotEmpty()
  max_people: number;

  @ApiPropertyOptional({ description: 'description', example: '' })
  @MaxLength(TABLE_SCHEMA.DESCRIPTION.LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'floor id', example: 1 })
  @IsInt()
  @IsNotEmpty()
  floor_id: number;
}
