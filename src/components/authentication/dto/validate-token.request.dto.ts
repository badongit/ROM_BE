import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class ValidateTokenDto {
  @ApiProperty()
  @IsJWT()
  @IsNotEmpty()
  token: string;
}
