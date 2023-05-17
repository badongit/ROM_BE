import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class BaseSocketDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  userId: number;
}
