import { Expose } from 'class-transformer';

export class DecodeRefreshTokenDto {
  @Expose()
  id: number;
}
