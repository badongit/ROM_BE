import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_CONSTANT } from '@src/constants/common';
import { JwtGuard } from '@src/core/guards/jwt.guard';
import { RoleGuard } from '@src/core/guards/roles.guard';
import { EmployeeRepository } from '@src/repositories/employee.repository';
import { Employee } from '../employee/entities/employee.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    PassportModule,
    JwtModule.register({ secret: JWT_CONSTANT.JWT_ACCESS_TOKEN_SECRET }),
  ],
  controllers: [AuthenticationController],
  providers: [
    JwtStrategy,
    AuthenticationService,
    { provide: 'IAuthenticationService', useClass: AuthenticationService },
    { provide: 'IEmployeeRepository', useClass: EmployeeRepository },
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
  exports: [
    { provide: 'IAuthenticationService', useClass: AuthenticationService },
  ],
})
export class AuthenticationModule {}
