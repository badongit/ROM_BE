import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ example: '412415r' })
  @Expose()
  access_token: string;

  @ApiProperty({ example: '412415r' })
  @Expose()
  refresh_token: string;
}
