import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTokenResponseDto {
  @ApiProperty({ example: '412415r' })
  @Expose()
  accessToken: string;
}
