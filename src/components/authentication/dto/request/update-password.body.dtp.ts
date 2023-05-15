import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@src/components/employee/entities/employee.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  user?: Employee;
}
