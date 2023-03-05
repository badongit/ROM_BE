import { ApiProperty } from '@nestjs/swagger';
import { RoleResponseDto } from '@src/components/role/dto/role.response.dto';
import { Expose, Type } from 'class-transformer';

export class EmployeeResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Nguyễn Thị Lan Anh' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'W01' })
  @Expose()
  code: string;

  @ApiProperty({ example: '0123456789' })
  @Expose()
  phoneNumber: string;

  @ApiProperty({ example: 1 })
  @Expose()
  status: number;

  @ApiProperty({ example: '2023-01-21T07:48:18.262Z' })
  @Expose()
  dateJoin: Date;

  @ApiProperty({ example: '2023-01-21T07:48:18.262Z' })
  @Expose()
  dateOut: Date;

  @ApiProperty({ example: 1 })
  @Expose()
  roleId: number;

  @ApiProperty({ type: RoleResponseDto })
  @Type(() => RoleResponseDto)
  @Expose()
  role: RoleResponseDto;

  @ApiProperty({ example: 3000000 })
  @Expose()
  salary: number;
}
