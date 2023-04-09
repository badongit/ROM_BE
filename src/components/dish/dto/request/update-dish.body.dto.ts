import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import DISH_SCHEMA from '../../constants/schema';
import { DishStatusEnum } from '../../constants/status.enum';

export class UpdateDishBodyDto {
  @ApiPropertyOptional({ description: "dish's name", example: 'Nướng hải sản' })
  @MaxLength(DISH_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: "dish's status", example: 1 })
  @Min(DISH_SCHEMA.PRICE.MIN)
  @IsEnum(DishStatusEnum)
  @Transform(({ value }) => +value)
  @IsOptional()
  status: DishStatusEnum;

  @ApiPropertyOptional({ description: "dish's price", example: 156000 })
  @Min(DISH_SCHEMA.PRICE.MIN)
  @IsNumber()
  @Transform(({ value }) => +value)
  @IsOptional()
  price: number;

  @ApiPropertyOptional({ description: "dish's description", example: '' })
  @Transform(({ value }) => value.trim())
  @MaxLength(DISH_SCHEMA.DESCRIPTION.LENGTH)
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'category id', example: 1 })
  @IsInt()
  @Transform(({ value }) => +value)
  @IsOptional()
  categoryId: number;

  image?: Express.Multer.File;
}
