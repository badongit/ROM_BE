import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ example: '412415r' })
  @Expose()
  accessToken: string;

  @ApiProperty({ example: '412415r' })
  @Expose()
  refreshToken: string;
}
