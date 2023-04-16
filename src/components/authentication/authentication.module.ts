import { CacheModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JWT_CONSTANT, REDIS_CONSTANT } from '@src/constants/common';
import { JwtGuard } from '@src/core/guards/jwt.guard';
import { RoleGuard } from '@src/core/guards/roles.guard';
import { EmployeeRepository } from '@src/repositories/employee.repository';
import * as redisStore from 'cache-manager-redis-store';
import { Employee } from '../employee/entities/employee.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    PassportModule,
    // CacheModule.register({
    //   store: redisStore,
    //   host: REDIS_CONSTANT.HOST,
    //   port: REDIS_CONSTANT.PORT,
    //   auth_pass: REDIS_CONSTANT.PASS,
    //   ttl: JWT_CONSTANT.REFRESH_TOKEN_EXPIRES_IN,
    //   isGlobal: true,
    // }),
    JwtModule.register({ secret: JWT_CONSTANT.ACCESS_TOKEN_SECRET }),
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
