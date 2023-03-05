import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import DISH_SCHEMA from '../../constants/schema';

export class CreateDishBodyDto {
  @ApiProperty({ description: "dish's name", example: 'Nướng hải sản' })
  @MaxLength(DISH_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "dish's price", example: 156000 })
  @Min(DISH_SCHEMA.PRICE.MIN)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({ description: "dish's description", example: '' })
  @Transform(({ value }) => value.trim())
  @MaxLength(DISH_SCHEMA.DESCRIPTION.LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'category id', example: 1 })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
