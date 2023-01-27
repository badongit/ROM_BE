import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import CATEGORY_SCHEMA from '../../constants/schema';

export class UpdateCategoryBodyDto {
  @ApiProperty({ description: "category's name", example: 'Nướng' })
  @MaxLength(CATEGORY_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: "category's active", example: true })
  @IsBoolean()
  @IsOptional()
  active: boolean;

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
