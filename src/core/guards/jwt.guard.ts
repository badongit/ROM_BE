import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from '@src/components/authentication/authentication.service';
import { IAuthenticationService } from '@src/components/authentication/interfaces/authentication.service.interface';
import { ResponseCodeEnum } from '@src/constants/enum/response-code.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,

    @Inject('IAuthenticationService')
    private readonly authenticationService: AuthenticationService,
  ) {
    super();
    console.log('--------------------', this.reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(this.reflector);
    console.log(
      '🚀 ~ file: jwt.guard.ts:22 ~ JwtGuard ~ classJwtGuardextendsAuthGuard ~ authenticationService',
      this.authenticationService,
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = await context.switchToHttp().getRequest();

    const res = await this.authenticationService.validateToken();

    if (res.statusCode === ResponseCodeEnum.OK) {
      req.employee = res.data;
      return true;
    }

    return false;
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
