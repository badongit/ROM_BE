import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Phục vụ' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'WAITER' })
  @Expose()
  code: string;
}
