import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IEmployeeRepository } from '@src/components/employee/interfaces/employee.repository.interface';
import { JWT_CONSTANT } from '@src/constants/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly employeeRepository: IEmployeeRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.employeeRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return new UnauthorizedException();
    }
    return user;
  }
}
