import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTokenBodyDto {
  @ApiProperty({ example: 'sajfasfjkasfj' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
