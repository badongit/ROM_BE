import { ApiProperty } from '@nestjs/swagger';
import { DetailEmployeeResponseDto } from '@src/components/employee/dto/response/detail-employee.response.dto';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ example: '412415r' })
  @Expose()
  accessToken: string;

  @ApiProperty({ example: '412415r' })
  @Expose()
  refreshToken: string;

  @ApiProperty({ type: DetailEmployeeResponseDto })
  @Expose()
  user: DetailEmployeeResponseDto;
}
