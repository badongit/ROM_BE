import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import STORE_SCHEMA from '../constants/schema';

export class UpdateStoreBodyDto {
  @ApiPropertyOptional({ example: 'Hadilao' })
  @MaxLength(STORE_SCHEMA.NAME.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 'images' })
  image: string;

  @ApiPropertyOptional({ example: '0123456789' })
  @Matches(STORE_SCHEMA.PHONE_NUMBER.REGEX)
  @MaxLength(STORE_SCHEMA.PHONE_NUMBER.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  phone_number: string;

  @ApiPropertyOptional({
    example: '2 Hải Triều, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh ',
  })
  @MaxLength(STORE_SCHEMA.ADDRESS.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ example: '' })
  @MaxLength(STORE_SCHEMA.DESCRIPTION.LENGTH)
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  description: string;
}
