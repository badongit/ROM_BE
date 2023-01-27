import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import CATEGORY_SCHEMA from '../../constants/schema';

export class CreateCategoryBodyDto {
  @ApiProperty({ description: "category's name ", example: 'Nướng' })
  @MaxLength(CATEGORY_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: "category's description ",
    example: 'món nướng',
  })
  @MaxLength(CATEGORY_SCHEMA.DESCRIPTION.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  description: string;
}
